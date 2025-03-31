import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner,Html5Qrcode } from "html5-qrcode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ModalMyMission = ({
  mission,
  missionType,
  onSubmitCode,
  onSubmitQRCode,
  onSubmitPhoto,
  onSubmitText,
  onClose,
  modalError,
  modalSuccess,
}) => {
  const [missionCode, setMissionCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [inputText, setInputText] = useState("")
  const [imageFiles, setImageFiles] = useState([]);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredText,setRequiredText] = useState("")
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // Open modal when component is rendered
    }
  }, []);

  // useEffect(() => {
  //   let scanner = null;

  //   // ฟังก์ชันที่ใช้ดึงข้อมูลกล้อง
  //   const getBackCamera = async () => {
  //     try {
  //       const cameras = await Html5Qrcode.getCameras(); // ดึงรายการกล้อง
  //       if (cameras && cameras.length > 0) {
  //         // ตรวจสอบว่ามีกล้องหลัง
  //         const backCamera = cameras.find(camera => camera.facing === "back");
  //         if (backCamera) {
  //           return backCamera.id;
  //         }
  //         // ถ้าไม่มีกล้องหลัง ก็เลือกกล้องแรกแทน
  //         return cameras[0].id;
  //       }
  //       throw new Error("No cameras found");
  //     } catch (err) {
  //       console.error("Error getting cameras:", err);
  //       return null; // ถ้าไม่พบกล้อง
  //     }
  //   };

  //   const startScanner = async () => {
  //     const backCameraId = await getBackCamera(); // หากล้องหลัง
  //     if (backCameraId) {
  //       // สร้าง scanner ด้วยกล้องหลัง
  //       scanner = new Html5QrcodeScanner(
  //         "reader",
  //         { 
  //           fps: 10, 
  //           qrbox: 250,
  //           cameraId: backCameraId, // เลือกกล้องหลัง
  //           showCameraSelector: false,  // ซ่อน UI สำหรับเลือกกล้อง
  //           showStopScanButton: false,  // ซ่อน UI ปุ่มหยุดการสแกน
  //         },
  //         false
  //       );

  //       scanner.render(
  //         (decodedText) => {
  //           setQrCode(decodedText);  // แสดงผล QR code ที่สแกนได้
  //           setIsScannerActive(false); // หยุดการสแกนเมื่อสำเร็จ
  //         },
  //         (errorMessage) => {
  //           console.error("QR Code Error:", errorMessage); // แสดง error ถ้าสแกนไม่สำเร็จ
  //         }
  //       );
  //     }
  //   };


  //   return () => {
  //     if (scanner) {
  //       scanner.clear().catch((err) => console.error("Error clearing scanner:", err));
  //     }
  //   };
  // }, [isScannerActive]);
  

  const handleMissionCodeSubmit = async (e) => {
    e.preventDefault();
    if (!missionCode.trim()) return;

    setIsSubmitting(true); // Set submitting state to true
    try {
      await onSubmitCode(missionCode);
      // Handle success, maybe show a success message
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleQRCodeSubmit = async () => {
    if (!qrCode.trim()) return;

    setIsSubmitting(true); // Set submitting state to true
    try {
      await onSubmitQRCode(qrCode);
      // Handle success, maybe show a success message
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleImageSubmit = async () => {
    if (imageFiles.length === 0){
      setRequiredText('Please Select Image')
    };

    setIsSubmitting(true); // Set submitting state to true
    try {
      await onSubmitPhoto(imageFiles);
      // Handle success, maybe show a success message
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      console.log('Input text is empty');
      return; // ถ้าเป็นค่าว่างหรือมีแค่ช่องว่าง จะไม่ทำอะไร
    }
  
    setIsSubmitting(true); // ตั้งสถานะการกำลังส่งเป็น true
    try {
      await onSubmitText(inputText); // เรียกฟังก์ชัน onSubmitText ที่ส่งข้อความ
      console.log("Submission successful"); // เพิ่มการแสดงผลเมื่อสำเร็จ
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false); // รีเซ็ตสถานะการกำลังส่ง
    }
  };  

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
            <p className="w-full max-h-32 overflow-auto break-words whitespace-pre-line">
            <strong>Description: </strong>{mission?.description}</p>
          </div>
        </div>
        {missionType === "QR" ? (
          <>
            <button
              onClick={() => setIsScannerActive(true)}
              className="btn rounded-badge btn-outline btn-accent text-white mb-4"
            >
              Start QR Scanner
            </button>
            {isScannerActive && <div id="reader" className="mb-4"></div>}
            {qrCode && (
              <div className="mt-4">
                <strong className="text-green-500">Scanned <CheckIcon /></strong>
              </div>
            )}
          </>
        ) : missionType === "Photo" ? (
          <>
            <div className="mb-4">
              <label htmlFor="uploadImage" className="block text-sm font-bold">
                Upload Images (Max: 3)
              </label>
              <input
                type="file"
                id="uploadImage"
                multiple
                accept="image/*"
                onChange={(e) => {
                  let files = Array.from(e.target.files);
                  if (files.length > 3) {
                    alert("You can upload a maximum of 3 images.");
                    files = files.slice(0, 3); // ตัดไฟล์ให้เหลือ 3 รูป
                  }
                  setImageFiles(files);
                }}
                className="file-input file-input-bordered w-full mt-2"
              />
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-4">
                <strong>Selected Images:</strong>
                <div className="flex space-x-2">
                  {imageFiles.map((file, index) => (
                    <div key={index}>
                      <img
                        src={URL.createObjectURL(file)} // Preview image
                        alt="Selected"
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() => setSelectedImage(URL.createObjectURL(file))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : missionType === "Text" ? ( // เพิ่มเงื่อนไขตรงนี้
          <form onSubmit={handleMissionCodeSubmit}>
            <div className="mb-4">
              <label
                htmlFor="inputText"
                className="block text-sm font-bold"
              >
                Enter Text
              </label>
              <textarea
                type="text"
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="textarea textarea-warning w-full mt-2 bg-bg border-layer-item rounded-2xl focus:border-heavy-color"
                required
                maxLength={255}
              />
            </div>
          </form>
        ) : (
          <form onSubmit={handleMissionCodeSubmit}>
            <div className="mb-4">
              <label
                htmlFor="missionCode"
                className="block text-sm font-bold"
              >
                Mission Code
              </label>
              <input
                type="text"
                id="missionCode"
                value={missionCode}
                onChange={(e) => setMissionCode(e.target.value)}
                className="input input-bordered w-full mt-2 bg-bg border-layer-item rounded-badge focus:border-heavy-color"
                required
              />
            </div>
          </form>
        )}

        {modalError && <p className="text-red-500 mt-2">{modalError}</p>}
        {modalSuccess && <p className="text-green-500 mt-2">{modalSuccess}</p>}

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

        {/* Buttons aligned in a row */}
        <div className="modal-action flex justify-end">

          <button
            onClick={
              missionType === "QR"
                ? handleQRCodeSubmit
                : missionType === "Photo"
                  ? handleImageSubmit
                  : missionType === "Text"
                    ? handleTextSubmit  // เรียกใช้ handleTextSubmit สำหรับ missionType เป็น "Text"
                    : handleMissionCodeSubmit
            }
            disabled={isSubmitting}
            className="btn rounded-badge btn-success text-white"
            // disabled={
            //   isSubmitting || // ถ้ากำลังส่งข้อมูลจะไม่สามารถกดได้
            //   (missionType === "QR" && !qrCode) ||  // สำหรับ QR ต้องมี qrCode
            //   (missionType === "Photo" && imageFiles.length === 0) || // สำหรับ Photo ต้องเลือกไฟล์ภาพ
            //   (missionType !== "QR" && missionType !== "Photo" && !missionCode) || // สำหรับ Mission Code ต้องกรอกโค้ด
            //   (missionType === "Text" && !inputText.trim()) // สำหรับ Text ต้องกรอกข้อความที่ไม่ใช่ช่องว่าง
            // }
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>

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

export default ModalMyMission;
