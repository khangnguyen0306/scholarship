import React from 'react'
import { useGetCertificateByIdQuery } from '../../services/CertificateAPI';

const Certy = ({ id, minScore }) => {
    console.log(id);
    const { data: certificateData, isLoading: isLoadingCertificate, error: errorCertificate } = useGetCertificateByIdQuery(id);
    console.log(certificateData);
    return (
        isLoadingCertificate ? <div>Loading...</div> :
        errorCertificate ? <div>Error...</div> :
        <div>
            {certificateData && (
                <div>
                    <p>Tên chứng chỉ: {certificateData.data.name}</p>
                    <p>Điểm tối thiểu: {minScore}</p>
                </div>
            )}
        </div>
    )
}

export default Certy