import { useState, useEffect } from 'react';
import {encodepwd,encode,decode} from './lib.tsx'
import Password from './Password.jsx';
import PersonCard from './PersonCard.jsx';
import './App.css';
import TagFilter from './TagFilter.jsx';
import './SHA256.jsx';
import SHA256 from './SHA256.jsx';
const sha256ofpwd="67ccbf6d-f24ce3a-960842e-29f93103-42857363-15990b72-68dfa5c7-2fe5d93e"
function decrypt(data,password){
  var n=data.id.length;
  var p1=encodepwd(password,131,998244353);
  var p2=encodepwd(password,137,998244353);
  var p=998244353;
  for(var i=0;i<n;i++){
    data.id[i]=decode(data.id[i],p1,p2,p);
  }
  n=data.item.length;
  for(var i=0;i<n;i++){
    data.item[i].name=decode(data.item[i].name,p1,p2,p);
    data.item[i].idcard=decode(data.item[i].idcard,p1,p2,p);
    var m=data.item[i].tags.length;
    for(var j=0;j<m;j++){
      data.item[i].tags[j]=data.id[data.item[i].tags[j]];
    }
  }
  return data.item;
}
function App() {
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        var response = await fetch('/data.json');
        if (!response.ok) throw new Error('无法加载数据文件');
        var data=await response.json();
        setEncryptedData(data);
      } catch (err) {
        setError(`加载数据失败`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 解密数据
  const handleDecrypt = async (password) => {
      setIsLoading(true);
      setError('');
      try {
      if (!encryptedData) {
        throw new Error('数据未加载完成');
      }
      const sha256 = new SHA256();
      if(sha256.hash(password)==sha256ofpwd){
        try {
          await setIsDecrypted(false);
          var response = await fetch('/exdata.json');
          if (!response.ok) throw new Error('无法加载数据文件');
          var dt=await response.json();
          console.log(dt);
          setEncryptedData(dt);
          var t=decrypt(dt,password);
          console.log(dt,password,t);
          setDecryptedData(t);
          setFilteredData(t);
          setIsDecrypted(true);
          return;
        } catch (err) {
          setError(`加载数据失败`);
        } finally {
          setIsLoading(false);
        }
      }
      var t=decrypt(encryptedData,password);
      setDecryptedData(t);
      setFilteredData(t);
      setIsDecrypted(true);
      sessionStorage.setItem('decrypted', 'true');
    } catch (err) {
      setError('解密失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 根据标签过滤数据
  const handleFilter = (selectedTags) => {
    if (selectedTags.length === 0) {
      setFilteredData(decryptedData);
      return;
    }
    
    const filtered = decryptedData.filter(person =>
      selectedTags.every(tag => person.tags.includes(tag))
    );
    
    setFilteredData(filtered);
  };

  // 统计信息
  const getStats = () => {
    const allTags = decryptedData.flatMap(person => person.tags);
    const uniqueTags = [...new Set(allTags)];
    
    return {
      totalPeople: decryptedData.length,
      totalTags: uniqueTags.length,
      filteredPeople: filteredData.length
    };
  };

  const stats = getStats();

  if (!isDecrypted) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>FFxherdb</h1>
        </header>
        <main className="app-main">
          <Password onDecrypt={handleDecrypt} isLoading={isLoading} />
          {error && <div className="global-error">{error}</div>}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h2>FFxherdb</h2>
        <p>共 {stats.totalPeople} 人，{stats.totalTags} 个不同标签</p>
      </header>
      
      <div className="app-container">
        <aside className="sidebar">
          <TagFilter 
            data={decryptedData} 
            onFilter={handleFilter}
          />
        </aside>
        <main className="content">
          <div className="content-header">
            <div className="stats">
              <span className="stat-item">
                显示: <strong>{stats.filteredPeople}</strong> 人
              </span>
              {stats.filteredPeople < stats.totalPeople && (
                <span className="stat-item filtered">
                  （已过滤 {stats.totalPeople - stats.filteredPeople} 人）
                </span>
              )}
            </div>
          </div>
          
          {filteredData.length === 0 ? (
            <div className="no-results">
              <p>没有找到匹配的人员</p>
              <p>请尝试选择其他标签</p>
            </div>
          ) : (
            <div className="persons-grid">
              {filteredData.map(person => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;