import React from 'react'
import CV from '../../assets/cv.pdf'

const CTA = () => {
    return (
        <div className='cta'>
            <a href={CV} download className='btn'>Download Resume</a>
            <a href="mailto:noahpro@gmail.com" className='btn btn-primary'>Let's Talk</a>
        </div>
    )
}

export default CTA
