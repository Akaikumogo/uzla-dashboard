'use client';

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, message, Statistic } from 'antd';
import { ArrowLeft, GraduationCap, ChevronRight } from 'lucide-react';

const { Title, Text } = Typography;

// Mock subjects data
const mockSubjects = [
  { id: '1', name: 'Matematika' },
  { id: '2', name: 'Fizika' },
  { id: '3', name: 'Kimyo' },
  { id: '4', name: 'Biologiya' },
  { id: '5', name: 'Tarix' },
  { id: '6', name: 'Geografiya' },
  { id: '7', name: 'Adabiyot' }
];

// Mock classes data (with subjectIds to link them)
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

// Mock resources data (to calculate new resources count)
export type ResourceDto = {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  grade: number; // 10 yoki 11
  classId: string; // class-001
  content: {
    videoUrl?: string;
    imageUrl?: string;
    text?: string;
    fileUrl?: string;
  };
  questions: string[]; // bog‘langan savollar ID’lari
  createdBy: string; // userId
  createdAt: string;
};

const generateMockResources = (): ResourceDto[] => [
  {
    id: 'res-001',
    title: "Algebra bo'yicha qo'llanma",
    description: "10-sinf algebra darsligi uchun qo'shimcha materiallar.",
    subjectId: '1',
    grade: 10,
    classId: 'class-001',
    content: { fileUrl: '/path/to/algebra_guide.pdf' },
    questions: [],
    createdBy: 'user1',
    createdAt: '2024-07-20'
  },
  {
    id: 'res-002',
    title: "Fizika formulalari to'plami",
    description: "Mexanika va termodinamika bo'yicha asosiy formulalar.",
    subjectId: '2',
    grade: 11,
    classId: 'class-003',
    content: { text: 'Formulalar matni' },
    questions: [],
    createdBy: 'user2',
    createdAt: '2024-07-22'
  },
  {
    id: 'res-003',
    title: 'Kimyoviy reaksiyalar jadvali',
    description: 'Organik va noorganik kimyo uchun reaksiyalar jadvali.',
    subjectId: '3',
    grade: 10,
    classId: 'class-001',
    content: { imageUrl: '/path/to/chemistry_reactions.png' },
    questions: [],
    createdBy: 'user1',
    createdAt: '2024-07-25'
  },
  {
    id: 'res-004',
    title: 'Biologiya test savollari',
    description: "Hujayra biologiyasi bo'yicha test savollari to'plami.",
    subjectId: '4',
    grade: 9,
    classId: 'class-004',
    content: { fileUrl: '/path/to/biology_tests.pdf' },
    questions: [],
    createdBy: 'user3',
    createdAt: '2024-07-28'
  }
];

export default function ResourcesClassesList() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState('');
  const [classesByGrade, setClassesByGrade] = useState<
    Record<number, typeof mockClasses>
  >({});

  useEffect(() => {
    const foundSubject = mockSubjects.find((s) => s.id === subjectId);
    if (!foundSubject) {
      message.error('Fan topilmadi!');
      navigate('/dashboard/resources');
      return;
    }
    setSubjectName(foundSubject.name);

    const linkedClasses = mockClasses.filter((cls) =>
      cls.subjectIds.includes(subjectId!)
    );

    const groupedClasses: Record<number, typeof mockClasses> =
      linkedClasses.reduce((acc, cls) => {
        if (!acc[cls.grade]) {
          acc[cls.grade] = [];
        }
        acc[cls.grade].push(cls);
        return acc;
      }, {} as Record<number, typeof mockClasses>);

    setClassesByGrade(groupedClasses);
  }, [subjectId, navigate]);

  // Calculate new resources count for a class (mock logic: resources uploaded today)
  const getNewResourcesCount = (classId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return generateMockResources().filter(
      (res) =>
        res.classId === classId &&
        res.subjectId === subjectId &&
        res.createdAt === today
    ).length;
  };

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button
            type="text"
            icon={<ArrowLeft size={20} />}
            onClick={() => navigate('/dashboard/resources')}
            className="!text-slate-600 dark:!text-slate-400 !mb-2"
          >
            Fanlar katalogiga qaytish
          </Button>
          <Title level={2} className="!mb-2 text-slate-900 dark:text-white">
            "{subjectName}" fani resurslari
          </Title>
          <Text className="text-slate-600 dark:text-slate-400">
            Sinflar bo'yicha ajratilgan manbalar
          </Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {Object.keys(classesByGrade)
          .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
          .map((grade) => (
            <Col xs={24} sm={12} md={8} lg={6} key={grade}>
              <Card
                className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                actions={[
                  <Link
                    to={`/dashboard/resources/${subjectId}/${
                      classesByGrade[Number.parseInt(grade)][0].id
                    }`}
                    key="enter"
                  >
                    <Button
                      type="link"
                      icon={<ChevronRight size={16} />}
                      className="!text-[#6bd281]"
                    >
                      Manbalarni ko'rish / qo'shish
                    </Button>
                  </Link>
                ]}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <Title
                    level={4}
                    className="!mb-0 text-slate-900 dark:text-white"
                  >
                    {grade}-sinf
                  </Title>
                </div>
                <Statistic
                  title={
                    <span className="text-slate-600 dark:text-slate-400">
                      Yangi manbalar
                    </span>
                  }
                  value={getNewResourcesCount(
                    classesByGrade[Number.parseInt(grade)][0].id
                  )}
                  valueStyle={{ color: '#f59e0b', fontSize: '1.5rem' }}
                  suffix={<Text className="text-slate-500">ta</Text>}
                />
              </Card>
            </Col>
          ))}
      </Row>
      {Object.keys(classesByGrade).length === 0 && (
        <Text className="text-slate-600 dark:text-slate-400">
          Bu fanga biriktirilgan sinflar topilmadi.
        </Text>
      )}
    </div>
  );
}
