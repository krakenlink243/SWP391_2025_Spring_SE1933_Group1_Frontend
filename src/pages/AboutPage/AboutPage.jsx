import './AboutPage.css'

export default function AboutPage() {
    return (
        <div className='about-page-container container-fluid text-white'>
            <div className='row'>
                <div className='spacer col-lg-1'></div>
                <div className='main-content col-lg-8'>
                    <h1>Greetings, Users</h1>
                    <div>
                        Welcome to our Website, as far as you know this is an educational work
                        made by our teams.
                    </div>
                </div>
                <div className='spacer col-lg-1'></div>
            </div>
        </div>
    );
}