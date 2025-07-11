import './Policy.css';


export function PrivacyPolicy() {
    return (
        <div className="policy-container container-fluid">
            <div className='row'>
                <div className='spacer col-lg-2'></div>
                <div className='main-content col-lg-8'>
                    <h1>Privacy Policy</h1>
                    <p>Last updated: July 11, 2025</p>

                    <p>This site is an educational project. We value your privacy and explain our practices below.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We may collect your email, username, and activity data for demonstration purposes only.</p>

                    <h2>2. How We Use Your Data</h2>
                    <p>Data is used to simulate user profiles, game purchases, and basic account interactions. No data is sold or shared with third parties.</p>

                    <h2>3. Data Storage</h2>
                    <p>Data is stored on temporary servers used only for this educational project. We do not apply commercial-level security or compliance.</p>

                    <h2>4. No Real-World Consequences</h2>
                    <p>Since this is a simulation, your data has no real-world value and cannot be used outside of this project context.</p>

                    <h2>5. Data Removal</h2>
                    <p>If you'd like your data removed, contact us and we will delete it manually.</p>

                    <p>Contact: <a href="mailto:example@studyproject.dev">example@studyproject.dev</a></p>
                </div>
                <div className='spacer col-lg-2'></div>
            </div>

        </div>
    );
}