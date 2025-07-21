import './Policy.css';
import { useTranslation } from 'react-i18next';

export function PrivacyPolicy() {
    const {t} = useTranslation();
    return (
        <div className="policy-container container-fluid">
            <div className='row'>
                <div className='spacer col-lg-2'></div>
                <div className='main-content col-lg-8'>
                    <h1>{t('Privacy Policy')}</h1>
                    <p>{t('Last updated: July 11, 2025')}</p>

                    <p>{t('This site is an educational project. We value your privacy and explain our practices below.')}</p>

                    <h2>{t('1. Information We Collect')}</h2>
                    <p>{t('We may collect your email, username, and activity data for demonstration purposes only.')}</p>

                    <h2>{t('2. How We Use Your Data')}</h2>
                    <p>{t('Data is used to simulate user profiles, game purchases, and basic account interactions. No data is sold or shared with third parties.')}</p>

                    <h2>{t('3. Data Storage')}</h2>
                    <p>{t('Data is stored on temporary servers used only for this educational project. We do not apply commercial-level security or compliance.')}</p>

                    <h2>{t('4. No Real-World Consequences')}</h2>
                    <p>{t('Since this is a simulation, your data has no real-world value and cannot be used outside of this project context.')}</p>

                    <h2>{t('5. Data Removal')}</h2>
                    <p>{t(`If you'd like your data removed, contact us and we will delete it manually.`)}</p>

                    <h2>{t('6. Cookies and Local Storage')}</h2>
                    <p>
                        {t('We use browser local storage to manage user sessions and preferences. No tracking or third-party cookies are used.')}
                    </p>

                    <p>
                        {t('While we take basic precautions, this project does not use HTTPS in all deployments, and stored data may not be encrypted. Use it at your own risk.')}
                    </p>


                    <p>{t('Contact')}: <a href="mailto:5fcl.system@gmail.com">5fcl.system@gmail.com</a></p>
                </div>
                <div className='spacer col-lg-2'></div>
            </div>

        </div>
    );
}