import { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Card, Row, Col, Typography, Button, Statistic } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

// Mock subjects data (from previous components)
const mockSubjects = [
  { id: '1', name: 'Matematika' },
  { id: '2', name: 'Fizika' },
  { id: '3', name: 'Kimyo' },
  { id: '4', name: 'Biologiya' },
  { id: '5', name: 'Tarix' },
  { id: '6', name: 'Geografiya' },
  { id: '7', name: 'Adabiyot' }
];

// Mock classes data (from previous components)
const mockClasses = [
  {
    id: 'class-001',
    name: '10-A sinf',
    grade: 10,
    subjectIds: ['1', '2', '3']
  },
  { id: 'class-002', name: '10-B sinf', grade: 10, subjectIds: ['3', '4'] },
  { id: 'class-003', name: '11-A sinf', grade: 11, subjectIds: ['1', '2'] },
  {
    id: 'class-004',
    name: '9-A sinf',
    grade: 9,
    subjectIds: ['1', '2', '3', '4', '5']
  },
  { id: 'class-005', name: '8-B sinf', grade: 8, subjectIds: ['5', '6', '7'] }
];

export default function ResourcesSubjectsList() {
  const [subjects] = useState(mockSubjects);

  // Calculate total classes linked to each subject
  const getLinkedClassesCount = (subjectId: string) => {
    return mockClasses.filter((cls) => cls.subjectIds.includes(subjectId))
      .length;
  };

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Subjects Grid */}
      <Row gutter={[24, 24]}>
        {subjects.map((subject) => (
          <Col xs={24} sm={12} md={8} lg={6} key={subject.id}>
            <Card
              className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
              actions={[
                <Link to={`/dashboard/resources/${subject.id}`} key="enter">
                  <Button
                    type="link"
                    icon={<ChevronRight size={16} />}
                    className="!text-[#6bd281]"
                  >
                    Resurslarni boshqarish
                  </Button>
                </Link>
              ]}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#6bd281] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Title
                  level={4}
                  className="!mb-0 text-slate-900 dark:text-white"
                >
                  {subject.name}
                </Title>
              </div>
              <Statistic
                title={
                  <span className="text-slate-600 dark:text-slate-400">
                    Biriktirilgan sinflar
                  </span>
                }
                value={getLinkedClassesCount(subject.id)}
                valueStyle={{ color: '#3b82f6', fontSize: '1.5rem' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        onClick={() => {
          navigate('/dashboard/science');
        }}
        type="primary"
      >
        Fan qo'shish
      </Button>
    </div>
  );
}
