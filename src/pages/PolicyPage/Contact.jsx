import './Policy.css';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

export function Contact() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <div className="policy-container container-fluid">
            <div className='row'>

                <div className='spacer col-lg-2'></div>
                <div className='main-content col-lg-8'>
                    <div className='d-flex flex-row justify-content-between p-2'>
                        <Button label={'Back'} onClick={() => navigate('/')} color='grey-button' />
                        <Button label={'About Us'} onClick={() => navigate('/about-us')} color='gradient-blue-button' />
                    </div>
                    <h1>{t('We are a small groups of 5 members who trying to learn how to create stuffs')}</h1>
                </div>
                <div className='spacer col-lg-2'></div>
            </div>
        </div>
    );
}