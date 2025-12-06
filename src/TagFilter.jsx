import React, { useState, useEffect } from 'react';
import './TagFilter.css';

const TagFilter = ({ data, onFilter }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (data && data.length > 0) {
      const allTags = data.flatMap(person => person.tags);
      const uniqueTags = [...new Set(allTags)].sort();
      setAvailableTags(uniqueTags);
    }
  }, [data]);
  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      // 触发过滤
      onFilter(newTags);
      return newTags;
    });
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
    onFilter([]);
  };
  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="tag-filter-container">
      <div className="filter-header">
        <h3>按标签筛选</h3>
        {selectedTags.length > 0 && (
          <button onClick={clearFilters} className="clear-button">
            清除筛选
          </button>
        )}
      </div>
      
      {/* 搜索框 */}
      <div className="search-box">
        <input
          type="text"
          placeholder="搜索标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* 已选标签 */}
      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <p className="selected-label">已选择:</p>
          <div className="selected-tags-list">
            {selectedTags.map(tag => (
              <span 
                key={tag} 
                className="tag selected"
                onClick={() => toggleTag(tag)}
              >
                {tag} ×
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 可用标签列表 */}
      <div className="available-tags">
        <div className="tags-grid">
          {filteredTags.map(tag => (
            <span
              key={tag}
              className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        {filteredTags.length === 0 && (
          <p className="no-tags">未找到匹配的标签</p>
        )}
      </div>
    </div>
  );
};

export default TagFilter;