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
              I began my story as a homeschooler whose public school experience wasn't letting me progress in STEM as fast as I could. From there I excelled by myself and did well in high school. I started taking community college classes early and planned on transferring to Virginia Tech. While doing all of this, I maintained my hobbies and interests. I love to dance ballet, do personal programming projects, and I became an Eagle Scout then. Now at Virginia Tech, I have been able to thrive as a full-time student double majoring in my interests of computer science and physics. While in college I've maintained an internship where I've gotten to learn what the professional workflow is, as well as how to be helpful and stay relevant. I strive one day to be a leader on a project that will impact the world for the better. I know I want to work on a team that I enjoy and can depend on. I can't wait to keep working my way up to where that dream becomes a reality.
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
