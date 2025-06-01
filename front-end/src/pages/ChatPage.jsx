import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/authSlice';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { useLazyGetChatInboxQuery, useLazyGetChatRoomsQuery, useMarkAsReadMutation } from '../services/ChatAPI';
import { ChevronsDown, Download, Image, Loader2, Paperclip, Smile, Star } from 'lucide-react';
import defaultAvatar from '../../public/images/av1.svg';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useUploadFileCloudinaryMutation, useGetFileMutation, useUploadFileMutation } from '../services/UploadAPI';
import { useCreateRatingMutation } from '../services/UserAPI';
import { useToast } from '@/components/ui/use-toast';
const SOCKET_URL = 'http://localhost:3000';
// const SOCKET_URL = import.meta.env.VITE_BE_API;

let socket;

const ChatPage = () => {
    const user = useSelector(selectCurrentUser);
    const { toast } = useToast();
    const [rooms, setRooms] = useState([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [getChatRooms] = useLazyGetChatRoomsQuery();
    const [getChatInbox] = useLazyGetChatInboxQuery();
    const [markAsRead] = useMarkAsReadMutation();
    const [loading, setLoading] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const docFileInputRef = useRef(null);
    const [uploadFileCloudinary] = useUploadFileCloudinaryMutation();
    const [uploadFile] = useUploadFileMutation();
    const [getFile] = useGetFileMutation();
    const [createRating] = useCreateRatingMutation();
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingStars, setRatingStars] = useState(0);

    // Kết nối socket và join tất cả room
    useEffect(() => {
        if (!user) return;
        socket = io(SOCKET_URL, { transports: ['websocket'] });
        // Lấy danh sách phòng chat
        const fetchRooms = async () => {
            setIsLoadingRooms(true);
            const res = await getChatRooms();
            // console.log(res);
            setRooms(res.data.data);
            // Join tất cả room để nhận realtime
            res.data.data.forEach(room => {
                socket.emit('join_room', room._id);
            });
            setIsLoadingRooms(false);
        };
        fetchRooms();

        // Nhận tin nhắn realtime
        socket.on('receive_message', (msg) => {
            setMessages(prev =>
                msg.roomId === currentRoom?._id ? [...prev, msg] : prev
            );
            // Tăng badge nếu không ở phòng đó
            setRooms(prevRooms =>
                prevRooms.map(r =>
                    r._id === msg.roomId && currentRoom?._id !== msg.roomId
                        ? { ...r, unreadCount: (r.unreadCount || 0) + 1 }
                        : r
                )
            );
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line
    }, [user, currentRoom?._id]);

    // Khi chọn phòng chat, lấy tin nhắn và mark as read
    const openRoom = async (room) => {
        setCurrentRoom(room);
        // Lấy tin nhắn
        const res = await getChatInbox(room._id);
        // console.log(res);
        setMessages(res.data.data);
        // Mark as read
        const resMarkAsRead = await markAsRead(room._id);
        console.log(resMarkAsRead);
        // Reset badge
        setRooms(prevRooms =>
            prevRooms.map(r =>
                r._id === room._id ? { ...r, unreadCount: 0 } : r
            )
        );
    };

    // Gửi tin nhắn
    const sendMessage = async () => {
        if (!input.trim() || !currentRoom) return;
        socket.emit('send_message', {
            roomId: currentRoom._id,
            senderId: user._id,
            content: input,
            type: 'text'
        });
        setInput('');
    };

    // Gửi file ảnh (Cloudinary)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Chỉ hỗ trợ gửi ảnh!');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File quá lớn (tối đa 10MB)');
            return;
        }
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await uploadFileCloudinary(formData);
            const fileUrl = res.data.url;

            socket.emit('send_message', {
                roomId: currentRoom._id,
                senderId: user._id,
                type: 'image',
                fileUrl,
                fileName: file.name
            });
        } catch (err) {
            alert('Lỗi khi upload ảnh!');
        } finally {
            setUploadingImage(false);
        }
    };

    // Gửi file tài liệu (local)
    const handleDocFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type.startsWith('image/')) {
            alert('Dùng nút gửi ảnh để gửi ảnh!');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File quá lớn (tối đa 10MB)');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadFile(formData);
        console.log(res);
        const fileUrl = res.data.fileUrl;
        socket.emit('send_message', {
            roomId: currentRoom._id,
            senderId: user._id,
            type: 'file',
            fileUrl,
            fileName: file.name
        });
    };

    // console.log(messages);
    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setShowScrollToBottom(false);
    }, [messages]);

    const openImageModal = (url) => {
        setModalImageUrl(url);
        setShowImageModal(true);
    };

    const handleDownloadImage = async () => {
        try {
            // Tải ảnh về dạng blob
            const response = await fetch(modalImageUrl, { mode: 'cors' });
            const blob = await response.blob();
            // Tạo link download local
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Lấy tên file từ URL hoặc đặt mặc định
            const name = modalImageUrl.split('/').pop() || 'image.jpg';
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Không thể tải ảnh. Có thể do CORS hoặc lỗi mạng.');
        }
    };

    const handleDownloadFile = async ({ fileUrl, originalName }) => {
        try {
            const blob = await getFile({ fileUrl, originalName }).unwrap();
            // console.log('blob:', blob, 'type:', typeof blob, 'instanceof Blob:', blob instanceof Blob);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.log(err);
            // alert('Không thể tải file. Có thể do CORS hoặc lỗi mạng.');
        }
    };

    if (!user) return <div>Vui lòng đăng nhập để sử dụng chat.</div>;

    return (
        <div className="flex h-[80vh] w-full mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Sidebar danh sách phòng chat */}
            <div className="w-1/3 border-r bg-gray-50 p-5 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Phòng chat</h2>
                {isLoadingRooms ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div> :
                    <>
                        {rooms.length === 0 && <div>Không có phòng chat nào.</div>}
                        <ul>
                            {rooms.map(room => {
                                const other = user._id === room.studentId._id ? room.mentorId : room.studentId;
                                return (
                                    <li
                                        key={room._id}
                                        className={`flex items-center justify-between p-2 rounded cursor-pointer mb-2 hover:bg-primary/10 ${currentRoom?._id === room._id ? 'bg-primary/10' : ''}`}
                                        onClick={() => openRoom(room)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img width={60} height={60} src={other.profileImage || defaultAvatar} alt="avatar" className="rounded-full" />
                                            <p>
                                                {other.firstName} {other.lastName}
                                            </p>
                                        </div>
                                        {room.unreadCount > 0 && (
                                            <p className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">{room.unreadCount}</p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                }
            </div>
            {/* Khung chat */}
            <div className="relative flex-1 flex flex-col rounded-md">
                {currentRoom ? (
                    <div className="mb-2 font-semibold text-white p-5 bg-blue-600 flex items-center justify-between">
                        <span>
                            Chat với {user._id === currentRoom.studentId._id ? currentRoom.mentorId.firstName + ' ' + currentRoom.mentorId.lastName : currentRoom.studentId.firstName + ' ' + currentRoom.studentId.lastName}
                        </span>
                        {user.role === 'student' && (
                            <Button
                                size="sm"
                                className="bg-white text-yellow-400 ml-4 hover:bg-yellow-400 hover:text-white"
                                onClick={() => { setShowRatingModal(true); setRatingStars(0); }}
                        >
                            <span className="flex items-center gap-2">Đánh giá mentor <Star fill='#facc15'/></span>
                        </Button>
                        )}
                    </div>
                ) : (
                    null
                )}
                <div
                    className="flex-1 p-4 overflow-y-auto relative"
                    ref={chatContainerRef}
                    onScroll={() => {
                        const el = chatContainerRef.current;
                        if (!el) return;
                        setShowScrollToBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
                    }}
                >
                    {currentRoom ? (
                        <>
                            {loading ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div> :
                                <>
                                    <div>
                                        {messages.map(msg => {
                                            if (msg.type === 'text' || !msg.type) {
                                                return <div key={msg._id} className={`mb-2 flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`px-3 py-2 rounded-lg ${msg.senderId._id === user._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>;
                                            }
                                            if (msg.type === 'image') {
                                                return (
                                                    <div key={msg._id} className={`mb-2 flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                                        <img
                                                            src={msg.fileUrl}
                                                            alt="img"
                                                            className="max-w-md rounded shadow cursor-pointer"
                                                            style={{ maxHeight: 240 }}
                                                            onClick={() => openImageModal(msg.fileUrl)}
                                                        />
                                                    </div>
                                                );
                                            }
                                            if (msg.type === 'file') {
                                                return (
                                                    <div key={msg._id} className={`mb-2 flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`px-3 py-2 rounded-lg border ${msg.senderId._id === user._id ? 'bg-blue-50' : 'bg-gray-100'}`}>
                                                            <a
                                                                href="#"
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    handleDownloadFile({ fileUrl: msg.fileUrl, originalName: msg.fileName });
                                                                }}
                                                                className="text-blue-600 underline"
                                                            >
                                                                📎 {msg.fileName}
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            if (msg.type === 'emoji') {
                                                return <span key={msg._id} style={{ fontSize: 32 }}>{msg.emoji}</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <div ref={messagesEndRef} />
                                </>
                            }
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">Chọn phòng chat để bắt đầu</div>
                    )}
                </div>
                {showScrollToBottom && (
                    <button
                        className="absolute right-1/2 bottom-20 -translate-y-1/2 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition"
                        onClick={() => {
                            chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
                            setShowScrollToBottom(false);
                        }}
                        aria-label="Scroll to bottom"
                    >
                        <ChevronsDown size={24} />
                    </button>
                )}
                {currentRoom && (
                    <div className="p-4 border-t flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-2"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Nhập tin nhắn..."
                        />
                        <Button onClick={sendMessage} className="bg-blue-600 text-white hover:bg-blue-700 transition">Gửi</Button>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt"
                            style={{ display: 'none' }}
                            ref={docFileInputRef}
                            onChange={handleDocFileChange}
                        />
                        <Button onClick={() => docFileInputRef.current.click()} variant="outline" className="ml-2 hover:bg-gray-600 transition">
                        <Paperclip />
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        {uploadingImage && (
                            <div className="absolute left-1/2 bottom-24 -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded shadow z-50 border border-blue-200">
                                <Loader2 className="animate-spin text-blue-600" />
                                <span>Đang gửi ảnh...</span>
                            </div>
                        )}
                        <Button onClick={() => fileInputRef.current.click()} variant="outline" className="ml-2   hover:bg-gray-600 transition" disabled={uploadingImage}>
                            <Image />
                        </Button>
                        <Button variant="outline" onClick={() => setShowEmojiPicker(v => !v)} className="ml-2   hover:bg-gray-600 transition">
                            <Smile />
                        </Button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-16 right-4 z-50">
                                <Picker
                                    data={data}
                                    onEmojiSelect={emoji => {
                                        setInput(input + emoji.native);
                                        setShowEmojiPicker(false);
                                    }}
                                    theme="light"
                                    previewPosition="none"
                                />
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Modal xem ảnh lớn */}
            {showImageModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative flex flex-col items-center">
                        <button
                            className="mt-4 px-4 py-2 absolute top-0 right-16 bg-white text-blue-600 rounded shadow hover:bg-blue-100 font-semibold"
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDownloadImage();
                            }}
                        >
                            <Download />
                        </button>
                        <img
                            src={modalImageUrl}
                            alt="img-large"
                            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg border-4 border-white"
                            onClick={e => e.stopPropagation()}
                        />

                        <button
                            className="absolute top-4 right-4 text-white text-3xl font-bold"
                            onClick={() => setShowImageModal(false)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {showRatingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg min-w-[620px]">
                        <h2 className="text-lg font-bold mb-4">Đánh giá mentor</h2>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const stars = ratingStars;
                                if (!stars) {
                                    alert('Vui lòng chọn số sao!');
                                    return;
                                }
                                const comment = e.target.comment.value;
                                try {
                                    const res = await createRating({
                                        mentorId: user._id === currentRoom.studentId._id ? currentRoom.mentorId._id : currentRoom.studentId._id,
                                        roomId: currentRoom._id,
                                        stars,
                                        comment,
                                    });
                                    // console.log(res);
                                    if(res.error ) {
                                        toast({
                                            title: "Lỗi đánh giá",
                                            description: res.error.data.error.message,
                                            variant: "destructive",
                                          });
                                        return;
                                    }else{
                                        toast({
                                            title: "Đánh giá thành công",
                                            description: res.data.message,
                                            className: "bg-green-500 text-white",
                                          });
                                        setShowRatingModal(false);
                                    }
                                } catch (err) {
                                    console.log(err);
                                    toast({
                                        title: "Lỗi đánh giá",
                                        description: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
                                        variant: "destructive",
                                      });
                                }
                            }}
                        >
                            <label className="block mb-2">Số sao:</label>
                            <div className="flex items-center gap-1 mb-4">
                                {[1,2,3,4,5].map(n => (
                                    <Star
                                        key={n}
                                        size={32}
                                        className="cursor-pointer"
                                        fill={n <= ratingStars ? '#facc15' : '#ffffff'}
                                        stroke="#facc15"
                                        onClick={() => setRatingStars(n)}
                                    />
                                ))}
                            </div>
                            <label className="block mb-2">Nhận xét:</label>
                            <textarea name="comment" className="border rounded px-2 py-1 mb-4 w-full" rows={3} />
                            <div className="flex justify-end gap-2">
                                <Button type="button" className="bg-gray-400 text-white hover:bg-gray-500" onClick={() => setShowRatingModal(false)}>Hủy</Button>
                                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Gửi đánh giá</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatPage; 