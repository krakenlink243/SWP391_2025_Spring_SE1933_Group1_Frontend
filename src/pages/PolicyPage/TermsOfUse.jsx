import './Policy.css';
import { useTranslation } from 'react-i18next';

export function TermsOfUse() {
    const {t} = useTranslation();
    return (
        <div className="policy-container container-fluid">
            <div className="row">
                <div className="spacer col-lg-2"></div>
                <div className="main-content col-lg-8">
                    <h1>{t('Terms of Use')}</h1>
                    <p>{t('Last updated: July 11, 2025')}</p>

                    <p>{t('This website is a non-commercial project built solely for educational purposes.')}</p>

                    <h2>{t('1. Educational Purpose Only')}</h2>
                    <p>{t('Trang web này mô phỏng hoạt động của một cửa hàng trò chơi điện tử cho mục đích học tập. Không có giao dịch mua thực tế nào được thực hiện, và không có sản phẩm nào được sở hữu hoặc giao hàng.')}</p>

                    <h2>{t('2. Fake Transactions')}</h2>
                    <p>{t('All payment-related actions are sandboxed and use fake data. No real money is involved in any action performed on this site.')}</p>

                    <h2>{t('3. No Ownership')}</h2>
                    <p>{t('Any games, images, or content shown are for demo purposes. You do not own or obtain the right to use any game shown here beyond this site simulation.')}</p>

                    <h2>{t('4. No Affiliation')}</h2>
                    <p>{t('This site is not affiliated with or endorsed by Steam, Valve Corporation, or any related entity. All logos, trademarks, and names are the property of their respective owners.')}</p>

                    <h2>{t("5. Responsible Usage")}</h2>
                    <p>{t('By using this website, you agree to use it responsibly and not to misrepresent it as a real product.')}</p>

                    <h2>{t('6. Disclaimer')}</h2>
                    <p>
                        {t('This website is a student project created for educational demonstration only. It does not offer real products or services.')}
                        {t('All actions simulated on this website, including purchases or account creation, are fictitious and not tied to any real business or transaction.')}
                    </p>

                    <h2>{t('7. Changes to Terms')}</h2>
                    <p>
                        {t('We may update these terms at any time without notice. Continued usage of the website implies acceptance of the latest version.')}
                    </p>


                    <p>{t('For questions, contact us at:')} <a href="mailto:5fcl.system@gmail.com">5fcl.system@gmail.com</a></p>
                </div>
                <div className="spacer col-lg-2"></div>
            </div>


        </div>
    );
}