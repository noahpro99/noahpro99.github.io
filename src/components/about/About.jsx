import React from 'react'
import './about.css';
import ME from '../../assets/me-1.jpg'
import { FaAward } from 'react-icons/fa'
import { FIUsers } from 'react-icons/fi'
import { VscFolderLibrary } from 'react-icons/vsc'


const About = () => {
  return (
    <section id='about'>
      <h5>Get To Know</h5>
      <h5>Me</h5>

      <div className="container">
        <div className='row'>
          <div className='col-sm'>
            <div className="about__me">
              <div className='about__me-image'>
                <img src={ME} alt="About Image" />
              </div>
            </div>
          </div>

          <div className='col-sm'>
            <p>
              I have been building things and solving puzzles ever since I can remember. It makes me excited to work on something meaningful with others that will have a lasting impact. My goal is to be a leader on a team project that will impact the world for the better. I am currently in college studying both Computer Science and Physics at Virginia Tech continuing to push my learning capabilities to make this come true.

              <br /><br />While being a full-time student and over the summer I worked as an intern for Fischer Jordan.  This experience put me on the fast track to excel in the professional workflow. I was able to thrive while being helpful and staying relevant. During my internship, I would never shy away from a problem even if I didn't have the skills at first. I will take what I learned with me and continue to grow as a professional. I have no doubt that if I keep at it, nothing can stop me from becoming the best version of myself.
            </p>
            <a href="mailto:noahpro@gmail.com" className="btn btn-primary">Let's Connect</a>
          </div>

        </div>
      </div>

      <div className='about__content'>
        <div className='about__cards'>
          <article className='about__card'>
            <FaAward className='about__icon' />
            <h5>Fischer Jordan -Internship</h5>
            <small>
              —Spearheaded a client-facing subscription website monitoring tool service.
              <br />—Collected and analyzed data for internal research on several collection campaigns, including LinkedIn, Twitter, and respective company websites.
              <br />—Managed various backend services for the company.
              <br />—Co-authored a research article on Artificial Intelligence development.</small>
          </article>
          <article className='about__card'>
            <FaAward className='about__icon' />
            <h5>Virginia Tech -Bachelors</h5>
            <small>
              —Transferred from NRVCC in Fall 2021.
              <br />—Expected graduation in Fall 2024 with a double major in Computer Science and Physics.
              <br />—Member of Tau Sigma National Honor Society </small>
          </article>
          <article className='about__card'>
            <FaAward className='about__icon' />
            <h5>Skills</h5>
            <small className='align-left'>
              —Experience with Java, Python, NumPy, C, JavaScript, R.
              <br />—Excel / Sheets Statistical Models (pivot tables, formulas, ect), and other Microsoft / Google products (AppsScript).
              <br />—Linux environments
              <br />3D CAD and Printing (Onshape/Solidworks)
              <br />3D simulation and rendering (Blender) </small>
          </article>
        </div>




      </div>
    </section>
  )
}

export default About
