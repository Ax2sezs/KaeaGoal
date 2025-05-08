import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ModalDetail = ({
  mission,
  onClose,
}) => {

  const [selectedImage, setSelectedImage] = useState(null);
  const dialogRef = useRef(null);


  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // Open modal when component is rendered
    }
  }, []);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close(); // Close modal
    }
    onClose(); // Notify parent to update state
  };

  // Close full-screen image modal when clicking outside the image or the close button
  const handleFullScreenClose = () => {
    setSelectedImage(null);
  };

  return (
    <dialog ref={dialogRef} className="modal modal-middle">
      <div className="modal-box bg-bg text-button-text">
        <div className="mb-5">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            style={{ "--swiper-pagination-color": "#FFFFFF", "--swiper-navigation-color": "#FFFFFF" }} // ✅ เปลี่ยนสี Pagination
            className="w-full h-48 rounded-2xl"
          >
            {mission.mission_Image.map((image, index) => (
              <SwiperSlide key={index} className="flex items-center justify-center">
                <img
                  src={image}
                  className="h-48 w-full object-cover rounded-2xl cursor-pointer"
                  alt={`Mission Image ${index + 1}`}
                  onClick={() => setSelectedImage(image)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="mb-5">
          <div className="flex flex-col">
            <h3 className="text-xl">Mission: {mission?.mission_Name}</h3>
            <p className="w-full max-h-48 overflow-auto break-words whitespace-pre-line">
              <strong>Description: </strong>{mission?.description}</p>
          </div>
        </div>

        {/* Full-Size Image Preview */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-5"
            onClick={handleFullScreenClose}
          >
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full-size preview"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
              <button
                onClick={handleFullScreenClose}
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}


        <div className="w-full flex justify-end">
          <button
            onClick={handleClose}
            className="btn rounded-badge btn-error btn-outline"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalDetail;
