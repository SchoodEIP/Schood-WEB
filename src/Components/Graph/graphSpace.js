import React from 'react';
import { TeacherGraphSpace } from './teacherGraphSpace'; // Assure-toi que le chemin est correct
import { StudentGraphSpace } from './studentGraphSpace'; // Assure-toi que ce composant est également créé
import '../../css/Components/Graph/graphSpace.scss';

export function GraphSpace() {
  const role = sessionStorage.getItem('role');
  const isTeacherOrAdmin = role === 'teacher' || role === 'administration';

  return (
    <div className='graph-box'>
      {isTeacherOrAdmin ? (
        <TeacherGraphSpace />
      ) : (
        <StudentGraphSpace />
      )}
    </div>
  );
}
