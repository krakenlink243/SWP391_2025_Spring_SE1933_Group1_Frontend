import './AboutPage.css'

export default function AboutPage() {

    const members = [
        {
            name: 'Phan Nguyễn Trường Sơn',
            linkedin: 'https://www.linkedin.com/in/sonphannguyentruong/',
            github: 'https://github.com/PhanNTSon',
            avatar: 'https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4',
            description: 'I\'m a Student of an University and I\'m love to learn new things about the world and technology',
            role: ''
        },
        {
            name: 'Đỗ Bá Thành',
            linkedin: 'https://www.linkedin.com/in/sonphannguyentruong/',
            github: 'https://github.com/PhanNTSon',
            avatar: 'https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4',
            description: '',
            role: ''
        },
        {
            name: 'Phan Gia Lộc',
            linkedin: 'https://www.linkedin.com/in/sonphannguyentruong/',
            github: 'https://github.com/Loc-Phan-ravennsi',
            avatar: 'https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4',
            description: '',
            role: ''
        },
        {
            name: 'Trần Sỹ Huy',
            linkedin: 'https://www.linkedin.com/in/sonphannguyentruong/',
            github: 'https://github.com/PhanNTSon',
            avatar: 'https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4',
            description: '',
            role: ''
        },
        {
            name: 'Vũ Quốc Hoàng',
            linkedin: 'https://www.linkedin.com/in/sonphannguyentruong/',
            github: 'https://github.com/PhanNTSon',
            avatar: 'https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4',
            description: '',
            role: ''
        },
    ]

    return (
        <div className='about-page-container container-fluid text-white'>
            <div className='row'>
                <div className='spacer col-lg-1'></div>
                <div className='main-content col-lg-10'>
                    <h1 className=''>Greetings, Users</h1>
                    <div className='mb-4'>
                        Welcome to our website. This platform was created as part of an educational project, developed by a passionate team of students with a shared interest in software engineering and web development.
                    </div>

                    <p>
                        Our goal is to deliver a practical, responsive, and aesthetically pleasing experience for users while sharpening our technical and teamwork skills.
                    </p>

                    <p>
                        This site serves as both a learning playground and a showcase of what young developers can achieve through collaboration and determination.
                    </p>

                    <p>
                        We strongly believe in learning by doing, and this project reflects our hands-on approach to applying what we've studied in real-world scenarios.
                    </p>

                    <h2>Meet Our Team</h2>
                    <p>We are a group of enthusiastic developers dedicated to building user-friendly and functional web applications. Here's a brief introduction to each team member:</p>

                    {
                        members.map((member, indx) => {
                            return (
                                <div key={indx} className={`member d-flex flex-column flex-md-row ${indx % 2 === 1 ? 'flex-md-row-reverse' : ''} align-items-center mb-5 w-100 gap-3`}>
                                    <div className='avatar'>
                                        <img src={member.avatar} className='w-100 h-100 rounded-circle'></img>
                                    </div>
                                    <div>
                                        <div className='name'>
                                            {member.name}
                                        </div>
                                        <div className='description'>
                                            {member.description}
                                        </div>
                                        <div className={`d-flex flex-row ${indx % 2 === 1 ? 'flex-md-row-reverse' : ''} align-items-center gap-3 py-2`}>
                                            <div className='contact-link' onClick={() => window.open(`${member.linkedin}`, '_blank')}>
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='h-100'><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" fill="#0F0F0F"></path> <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" fill="#0F0F0F"></path> <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" fill="#0F0F0F"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" fill="#0F0F0F"></path> </g></svg>
                                            </div>
                                            <div className='contact-link' onClick={() => window.open(`${member.github}`, '_blank')}>
                                                <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="#000000" className='h-100'><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>github</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M24,1.9a21.6,21.6,0,0,0-6.8,42.2c1,.2,1.8-.9,1.8-1.8V39.4c-6,1.3-7.9-2.9-7.9-2.9a6.5,6.5,0,0,0-2.2-3.2C6.9,31.9,9,32,9,32a4.3,4.3,0,0,1,3.3,2c1.7,2.9,5.5,2.6,6.7,2.1a5.4,5.4,0,0,1,.5-2.9C12.7,32,9,28,9,22.6A10.7,10.7,0,0,1,11.9,15a6.2,6.2,0,0,1,.3-6.4,8.9,8.9,0,0,1,6.4,2.9,15.1,15.1,0,0,1,5.4-.8,17.1,17.1,0,0,1,5.4.7,9,9,0,0,1,6.4-2.8,6.5,6.5,0,0,1,.4,6.4A10.7,10.7,0,0,1,39,22.6C39,28,35.3,32,28.5,33.2a5.4,5.4,0,0,1,.5,2.9v6.2a1.8,1.8,0,0,0,1.9,1.8A21.7,21.7,0,0,0,24,1.9Z"></path> </g> </g> </g></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                    <div>
                        We hope you enjoy exploring our project. Thank you for visiting!
                    </div>
                </div>
                <div className='spacer col-lg-1'></div>
            </div>
        </div>
    );
}