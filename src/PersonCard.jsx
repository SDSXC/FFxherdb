import React from 'react';
import './PersonCard.css';

const PersonCard = ({person}) => {
  return (
    <div className="person-card">
      <div className="person-header">
        <p className="person-name">姓名：{person.name}</p>
        <p className="person-id">学号：{person.id}</p>
        <p className="person-idcard">身份证号：{person.idcard}</p>
        <p className="person-tag">标签：</p>
        <div className="tags-container">
          {person.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default PersonCard;