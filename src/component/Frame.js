import { useLocation } from 'react-router-dom';
import PreviewFrame from './PreviewFrame';
import { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; 
import './Frame.css';
import LoadingPopup from './LoadingPopup';
import { createFinalImage } from '../utils/createFinalImage';


const FRAME_OPTIONS = [
    // { id: 'basic', name: '기본', url: '/frames/frame-basic.png' },
    // { id: 'test2', name: '기본', url: '/frames/frame-christmas.png' },
    // { id: 'test3', name: '기본', url: '/frames/frame-3.png' },
    // { id: 'test4', name: '기본', url: '/frames/frame-4.png' },
    // { id: 'test5', name: '기본', url: '/frames/frame-5.png' },
    // { id: 'test7', name: '기본', url: '/frames/frame-7.png' },
    { id: 'basic', name: '기본', url: '/frames/frame-journey.png' },
    { id: 'frame2', name: '기본', url: '/frames/frame-ticket.png' },
]

const FRAME_THUMBNAILS = [
    // { id: 'basic', url: '/thumbnails/thumb-basic.png' },
    // { id: 'test2', url: '/thumbnails/thumb-christmas.png' },
    // { id: 'test3', url: '/thumbnails/thumb-4.png' },
    // { id: 'test4', url: '/thumbnails/thumb-4.png' },
    // { id: 'test5', url: '/thumbnails/thumb-5.png' },
    // { id: 'test7', url: '/thumbnails/thumb-7.png' },
    { id: 'basic', url: '/thumbnails/thumb-journey.png' },
    { id: 'frame2', url: '/thumbnails/thumb-ticket.png' },
]

export default function Frame() {
    const location = useLocation();
    const photos = location.state.photos;

    const [selectedFrameId, setSelectedFrameId] = useState('basic');
    const selectedFrame = FRAME_OPTIONS.find(frame => frame.id === selectedFrameId);

    const settings = {
        dots: false,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    function thumbnailClick(frameId) {
        setSelectedFrameId(frameId);
    }

    const [popupVisible, setPopupVisible] = useState(false);
    const [qrUrl, setQrUrl] = useState(null);


    function base64ToFile(base_data, filename) {

        var arr = base_data.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    async function uploadToServer(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = fetch('https://boisterous-carla-subcommissarial.ngrok-free.dev/upload', {
            method: 'POST',
            body: formData
        })

        const url = (await response).text();
        return url;
    }

    async function shareImage(file) {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "포토부스 사진",
                    text: "여울인의 밤 포토부스",
                });
            } catch (error) {
                console.log("공유 실패", error);
            }
        } else {
            alert("이 브라우저는 공유를 지원하지 않습니다.");
        }
    }

    async function goNext() {
        setPopupVisible(true);

        const finalImageBase64 = await createFinalImage(photos, selectedFrame.url);

        var file = base64ToFile(finalImageBase64, 'finalImage.jpg');

        // const uploadedUrl = await uploadToServer(file);
        // setQrUrl(uploadedUrl);

        await shareImage(file);
        
        setPopupVisible(false);

    }

    return (
        <div className='frame-select-wrapper'>
            <PreviewFrame photos={photos} frameUrl={selectedFrame.url} />

            {/* <LoadingPopup visible={popupVisible} qrUrl={qrUrl} /> */}

            <Slider {...settings}>
                {FRAME_OPTIONS.map(frame => {
                    const isSelected = selectedFrameId === frame.id;
                    const thumbnail = FRAME_THUMBNAILS.find(thumb => thumb.id === frame.id);
                    
                    return (
                        <div key={frame.id} className='frame-wrapper'>
                            <img
                                src={thumbnail.url}
                                width="160px"
                                height="160px"
                                className={`frame-thumbnail ${selectedFrameId === frame.id ? 'selected' : ''}`}
                                onClick={() => thumbnailClick(frame.id)}
                            />

                            {isSelected && (
                                <div className='selected'></div>
                            )}

                        </div>
                    )
                })}
            </Slider>

            <button
                className={`check-btn ${selectedFrameId ? 'active' : ''}`}
                disabled={!selectedFrameId}
                onClick={goNext} 
            > ✔️ </button>
        </div>
    )
}