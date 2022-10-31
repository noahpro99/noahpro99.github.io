import React from 'react'
import { BsLinkedin } from 'react-icons/bs'
import { FaGithub } from 'react-icons/fa'

const headerSocials = () => {
    return (
        <div className='header__socials'>
            <a href='https://www.linkedin.com/in/noah-provenzano-90/' target="_blank"><BsLinkedin /></a>
            <a href='https://github.com/noahpro99/' target="_blank"><FaGithub /></a>
        </div>
    )
}

export default headerSocials
