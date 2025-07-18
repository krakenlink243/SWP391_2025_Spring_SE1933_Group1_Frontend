import './GroupSettingPopup.css';

export default function GroupSettingPopup({setOpenPopup}) {
    return (
        <div className="group-setting-popup-container">
            <div className='group-setting-popup-wrapper' >
                <div className='floater' onClick={() => setOpenPopup(false)}>✕</div>
                <div className='left-col'>
                    <div className="title">Group Settings</div>
                </div>
                <div className='right-col'></div>
            </div>
        </div>
    );
}