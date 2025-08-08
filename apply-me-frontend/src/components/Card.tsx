import { useState } from 'react';
import { cardInterface } from '../types'
import styles from './Card.module.css'
import { Basic as Dropzone } from './drop';

function Card({ title, description, description2, ...props }: cardInterface) {
  const [jobDescription, setJobDescription] = useState('');

  return (
    <article className={`stack-lg ${styles.card}`}>
      <div >
        <h3 className={styles.title}>{title}</h3>
        {/* Accent image under the title */}
        <img
          src="/arrow.png" // Change this to your image path
          alt=""
          className={styles.accentImage}
          aria-hidden="true"
        />
        <div className='stack-sm'>
        {description && (
          <>
            <small className={styles.stepThree}>Step 1: Copy and paste a job description for the resume to be based on.</small>
            <textarea
              maxLength={4000}
              className={styles.description}
              name="description"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <small className={styles.description}>{description}</small>
            <small className={styles.description2}>{description2}</small>
          </>
        )}
        </div>
      </div>
        
      <Dropzone jobDescription={jobDescription} />
    </article>
  );
}
export default Card;
