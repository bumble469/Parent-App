// Import images directly
import imgBruceMars from '../../../assets/images/bruce-mars.jpg';
import imgIvanaSquare from '../../../assets/images/ivana-square.jpg';
import imgKalVisuals from '../../../assets/images/kal-visuals-square.jpg';
import imgMarie from '../../../assets/images/marie.jpg';
import imgTeam2 from '../../../assets/images/team-2.jpg';
import imgTeam3 from '../../../assets/images/team-3.jpg';
import imgTeam4 from '../../../assets/images/team-4.jpg';
import imgTeam5 from '../../../assets/images/team-5.jpg';

// Faculty data with updated image imports and single subjects
const facultyData = {
  teachingStaff: [
    {
      name: 'Dr. John Doe',
      title: 'Professor',
      qualifications: 'PhD in Artificial Intelligence',
      type: 'Regular',
      image: imgBruceMars, // Updated path
      currentSem: true,
      subjects: ['Linux'], // Only one subject
    },
    {
      name: 'Dr. Jane Smith',
      title: 'Associate Professor',
      qualifications: 'PhD in Cybersecurity',
      type: 'Regular',
      image: imgIvanaSquare, // Updated path
      currentSem: true,
      subjects: ['INS'], // Only one subject
    },
    {
      name: 'Dr. Michael Johnson',
      title: 'Assistant Professor',
      qualifications: 'PhD in Data Science',
      type: 'Regular',
      image: imgKalVisuals, // Updated path
      currentSem: false,
      subjects: ['DataMining'], // Only one subject
    },
    {
      name: 'Dr. Emily Davis',
      title: 'Lecturer',
      qualifications: 'MSc in Software Engineering',
      type: 'Regular',
      image: imgMarie, // Updated path
      currentSem: true,
      subjects: ['ASP.NET'], // Only one subject
    },
    {
      name: 'Dr. William Brown',
      title: 'Senior Lecturer',
      qualifications: 'PhD in Machine Learning',
      type: 'Regular',
      image: imgTeam2, // Updated path
      currentSem: false,
      subjects: ['Java'], // Only one subject
    },
    {
      name: 'Dr. Olivia Wilson',
      title: 'Lecturer',
      qualifications: 'MSc in Network Security',
      type: 'Regular',
      image: imgTeam3, // Updated path
      currentSem: true,
      subjects: ['Android'], // Only one subject
    },
    {
      name: 'Dr. Alan Turing',
      title: 'Visiting Professor',
      qualifications: 'PhD in Theoretical Computer Science',
      type: 'Visiting',
      image: imgTeam4, // Updated path
      currentSem: false,
      subjects: ['COD'], // Only one subject
    },
    {
      name: 'Dr. Ada Lovelace',
      title: 'Visiting Professor',
      qualifications: 'PhD in Mathematics',
      type: 'Visiting',
      image: imgTeam5, // Updated path
      currentSem: true,
      subjects: ['Statistics'], // Only one subject
    },
    {
      name: 'Dr. Grace Hopper',
      title: 'Visiting Professor',
      qualifications: 'PhD in Computer Programming',
      type: 'Visiting',
      image: imgBruceMars, // Updated path
      currentSem: false,
      subjects: ['C Programming'], // Only one subject
    },
  ],
  nonTeachingStaff: [
    {
      name: 'Mr. James Bond',
      title: 'Lab Assistant',
      qualifications: 'BSc in Computer Science',
      image: imgIvanaSquare, // Updated path
      currentSem: true,
    },
    {
      name: 'Ms. Sarah Connor',
      title: 'Administrative Officer',
      qualifications: 'MSc in Administration',
      image: imgTeam2, // Updated path
      currentSem: true,
    },
  ],
};

export default facultyData;
