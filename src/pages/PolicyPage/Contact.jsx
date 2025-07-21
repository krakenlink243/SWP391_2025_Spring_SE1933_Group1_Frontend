import './Policy.css';
import { useTranslation } from 'react-i18next';

export function Contact() {
    const {t} = useTranslation();
    return (
        <div className="policy-container container-fluid">
            <div className='row'>
                <div className='spacer col-lg-2'></div>
                <div className='main-content col-lg-8'>
                    <h1>{t('We are a small groups of 5 members who trying to learn how to create stuffs')}</h1>
                </div>
                <div className='spacer col-lg-2'></div>
            </div>
        </div>
    );
}