import React from 'react';
import { List, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { books } from '../data/books';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
