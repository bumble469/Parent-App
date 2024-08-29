export const analyzeSubjects = (subjects, marks) => {
    // Filter strong and weak subjects based on percentage criteria
    const strongSubjects = subjects.map((label, index) => {
      return { name: label, percentage: marks[index] };
    }).filter(subject => subject.percentage > 80);
  
    const weakSubjects = subjects.map((label, index) => {
      return { name: label, percentage: marks[index] };
    }).filter(subject => subject.percentage < 70);
  
    return { strongSubjects, weakSubjects };
  };
  