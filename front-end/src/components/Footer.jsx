
import React from 'react';
import { Award, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Award className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gradient-primary">Grant Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tìm kiếm cơ hội học bổng mơ ước của bạn. Kết nối sinh viên với các trường đại học hàng đầu.
            </p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-4">Liên kết nhanh</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Liên hệ</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-4">Kết nối với chúng tôi</p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Grant Hub. Bảo lưu mọi quyền.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Được phát triển với <span role="img" aria-label="love">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
