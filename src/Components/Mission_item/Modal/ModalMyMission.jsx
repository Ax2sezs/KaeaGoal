import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import CheckIcon from '@mui/icons-material/Check';

const ModalMyMission = ({
  mission,
  missionType,
  onSubmitCode,
  onSubmitQRCode,
  onSubmitPhoto,
  onClose,
  modalError,
  modalSuccess,
}) => {
  const [missionCode, setMissionCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // Open modal when component is rendered
    }
  }, []);

  useEffect(() => {
    let scanner = null;
    if (isScannerActive) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          setQrCode(decodedText);
          setIsScannerActive(false); // Stop scanner after successful scan
        },
        (errorMessage) => {
          console.error("QR Code Error:", errorMessage);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((err) => console.error("Error clearing scanner:", err));
      }
    };
  }, [isScannerActive]);

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
    if (imageFiles.length === 0) return;

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
      <div className="modal-box bg-bg">
        <div className="mb-5">
          <img
            src={mission.mission_Image[0]}
            className="h-48 w-full object-cover rounded-2xl cursor-pointer"
            alt="Mission"
            onClick={() => setSelectedImage(mission.mission_Image[0])}
          />
        </div>
        <div className="mb-5">
          <div className="flex flex-col">
            <h3 className="text-xl">Mission: {mission?.mission_Name}</h3>
            <p>Status: {mission?.verification_Status}</p>
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
                <strong className="text-green-500">Scanned <CheckIcon/></strong>
              </div>
            )}
          </>
        ) : missionType === "Photo" ? (
          <>
            <div className="mb-4">
              <label htmlFor="uploadImage" className="block text-sm font-bold">
                Upload Images
              </label>
              <input
                type="file"
                id="uploadImage"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
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
                className="input input-bordered w-full mt-2"
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
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleFullScreenClose}
          >
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full-size preview"
                className="max-w-full max-h-full object-contain"
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
                : handleMissionCodeSubmit
            }
            className="btn rounded-badge btn-success text-white"
            disabled={isSubmitting}
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
