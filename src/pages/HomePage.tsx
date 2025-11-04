import React, { useEffect, useState } from 'react';
import { List, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/books').then(res => setBooks(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={books}
        renderItem={book => (
          <List.Item>
            <Card
              title={book.title}
              onClick={() => navigate(`/reader/${book.id}`)}
              hoverable
            >
              {book.summary}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default HomePage;
