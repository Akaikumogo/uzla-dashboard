/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Users,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import {
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Statistic,
  Tooltip,
  Popconfirm,
  Card,
  InputNumber
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Search: AntSearch } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Class data type
export type ClassDto = {
  id: string;
  name: string;
  grade: number;
  description?: string;
  subjects: string[];
  teacher: string;
  studentsCount: number;
  maxStudents: number;
  status: 'active' | 'inactive';
  createdDate: string;
  schedule?: string;
  subjectMastery: Record<string, number>; // Fanlar bo'yicha o'zlashtirish darajasi (subjectId: percentage)
};

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

// Mock teachers data
const mockTeachers = [
  { id: '1', name: 'Ahmadjon Karimov' },
  { id: '2', name: 'Malika Tosheva' },
  { id: '3', name: 'Bobur Alimov' },
  { id: '4', name: 'Nilufar Rahimova' },
  { id: '5', name: 'Jasur Nazarov' }
];

// Generate mock classes
const generateMockClasses = (): ClassDto[] => [
  {
    id: 'class-001',
    name: '10-A sinf',
    grade: 10,
    description: "Matematika yo'nalishi bo'yicha ixtisoslashgan sinf",
    subjects: ['1', '2', '3'],
    teacher: '1',
    studentsCount: 28,
    maxStudents: 30,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Chorshanba, Juma',
    subjectMastery: { '1': 85, '2': 70, '3': 60 } // Matematika: 85%, Fizika: 70%, Kimyo: 60%
  },
  {
    id: 'class-002',
    name: '10-B sinf',
    grade: 10,
    description: "Biologiya yo'nalishi bo'yicha ixtisoslashgan sinf",
    subjects: ['3', '4'],
    teacher: '2',
    studentsCount: 25,
    maxStudents: 30,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Seshanba, Payshanba, Shanba',
    subjectMastery: { '3': 75, '4': 90 } // Kimyo: 75%, Biologiya: 90%
  },
  {
    id: 'class-003',
    name: '11-A sinf',
    grade: 11,
    description: "Fizika-matematika yo'nalishi",
    subjects: ['1', '2'],
    teacher: '3',
    studentsCount: 22,
    maxStudents: 25,
    status: 'active',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Seshanba, Juma',
    subjectMastery: { '1': 78, '2': 82 } // Matematika: 78%, Fizika: 82%
  },
  {
    id: 'class-004',
    name: '9-A sinf',
    grade: 9,
    description: "Umumiy ta'lim sinfi",
    subjects: ['1', '2', '3', '4', '5'],
    teacher: '4',
    studentsCount: 30,
    maxStudents: 32,
    status: 'active',
    createdDate: '2023-09-01',
    subjectMastery: { '1': 70, '2': 65, '3': 72, '4': 80, '5': 75 },
    schedule: 'Har kuni'
  },
  {
    id: 'class-005',
    name: '8-B sinf',
    grade: 8,
    description: "Gumanitar yo'nalish sinfi",
    subjects: ['5', '6', '7'],
    teacher: '5',
    studentsCount: 18,
    maxStudents: 30,
    status: 'inactive',
    createdDate: '2023-09-01',
    schedule: 'Dushanba, Chorshanba, Payshanba',
    subjectMastery: { '5': 68, '6': 70, '7': 65 }
  }
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassDto[]>(generateMockClasses());
  const [filteredClasses, setFilteredClasses] = useState<ClassDto[]>(
    generateMockClasses()
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [form] = Form.useForm();

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = mockSubjects.find((s) => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown';
  };

  // Filter classes
  useEffect(() => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(
        (classItem) =>
          classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classItem.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          getTeacherName(classItem.teacher)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (classItem) => classItem.status === statusFilter
      );
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(
        (classItem) => classItem.grade.toString() === gradeFilter
      );
    }

    setFilteredClasses(filtered);
  }, [classes, searchTerm, statusFilter, gradeFilter]);

  // Statistics
  const stats = {
    total: classes.length,
    active: classes.filter((c) => c.status === 'active').length,
    totalStudents: classes.reduce((acc, c) => acc + c.studentsCount, 0),
    avgStudents: Math.round(
      classes.reduce((acc, c) => acc + c.studentsCount, 0) / classes.length
    )
  };

  // Get grade color
  const getGradeColor = (grade: number) => {
    const colors: { [key: number]: string } = {
      8: 'blue',
      9: 'green',
      10: 'orange',
      11: 'purple'
    };
    return colors[grade] || 'default';
  };

  // Table columns
  const columns: ColumnsType<ClassDto> = [
    {
      title: 'Sinf',
      key: 'class',
      render: (record: ClassDto) => (
        <Link
          to={`/dashboard/classes/${record.id}`}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-[#6bd281] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {record.name}
            </div>
            <div className="text-sm text-slate-500 truncate max-w-xs">
              {record.description}
            </div>
            <Tag color={getGradeColor(record.grade)}>{record.grade}-sinf</Tag>
          </div>
        </Link>
      )
    },
    {
      title: 'Sinf rahbari',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacherId: string) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-400" />
          <span className="text-slate-700 dark:text-slate-300">
            {getTeacherName(teacherId)}
          </span>
        </div>
      )
    },
    {
      title: 'Fanlar',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects: string[]) => (
        <div className="flex flex-wrap gap-1">
          {subjects.length > 0 ? (
            subjects.slice(0, 3).map((subjectId) => (
              <Tag key={subjectId} color="blue" className="text-xs">
                {getSubjectName(subjectId)}
              </Tag>
            ))
          ) : (
            <Tag color="default">Fanlar tayinlanmagan</Tag>
          )}
          {subjects.length > 3 && (
            <Tag color="default" className="text-xs">
              +{subjects.length - 3} ta
            </Tag>
          )}
        </div>
      )
    },
    {
      title: "O'quvchilar",
      key: 'students',
      render: (record: ClassDto) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-[#6bd281]">
            {record.studentsCount}/{record.maxStudents}
          </div>
          <div className="text-xs text-slate-500">
            {Math.round((record.studentsCount / record.maxStudents) * 100)}%
            to'ldirilgan
          </div>
        </div>
      ),
      sorter: (a: ClassDto, b: ClassDto) => a.studentsCount - b.studentsCount
    },
    {
      title: 'Jadval',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule: string) => (
        <div className="text-sm text-slate-600 dark:text-slate-400 max-w-32 truncate">
          {schedule || 'Belgilanmagan'}
        </div>
      )
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Faol' : 'Nofaol'}
        </Tag>
      ),
      filters: [
        { text: 'Faol', value: 'active' },
        { text: 'Nofaol', value: 'inactive' }
      ],
      onFilter: (value: any, record: ClassDto) => record.status === value
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: ClassDto) => (
        <div className="flex gap-2">
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          <Popconfirm
            title="Sinfni o'chirish"
            description="Haqiqatan ham bu sinfni o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Tooltip title="O'chirish">
              <Button
                type="text"
                icon={<Trash2 size={16} />}
                className="text-red-600 hover:text-red-800"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      )
    }
  ];

  // Handle create new class
  const handleCreate = () => {
    setEditingClass(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  // Handle edit class
  const handleEdit = (classItem: ClassDto) => {
    setEditingClass(classItem);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: classItem.name,
      grade: classItem.grade,
      description: classItem.description,
      subjects: classItem.subjects,
      teacher: classItem.teacher,
      maxStudents: classItem.maxStudents,
      status: classItem.status,
      schedule: classItem.schedule
    });
  };

  // Handle delete class
  const handleDelete = (id: string) => {
    setClasses(classes.filter((classItem) => classItem.id !== id));
    message.success("Sinf muvaffaqiyatli o'chirildi");
  };

  // Handle form submit
  const handleSubmit = (values: any) => {
    if (editingClass) {
      // Update existing class
      setClasses(
        classes.map((classItem) =>
          classItem.id === editingClass.id
            ? { ...classItem, ...values }
            : classItem
        )
      );
      message.success('Sinf muvaffaqiyatli yangilandi');
    } else {
      // Create new class
      const newClass: ClassDto = {
        id: Date.now().toString(),
        ...values,
        subjects: values.subjects || [],
        studentsCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        subjectMastery: {} // Yangi sinf uchun bo'sh o'zlashtirish darajasi
      };
      setClasses([...classes, newClass]);
      message.success("Yangi sinf muvaffaqiyatli qo'shildi");
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingClass(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-full bg-slate-50 dark:bg-[#0f0f0f]">
      {/* Statistics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-green-400 to-green-600 border-0">
            <Statistic
              title={<span className="text-white">Jami Sinflar</span>}
              value={stats.total}
              prefix={<GraduationCap className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-blue-400 to-blue-600 border-0">
            <Statistic
              title={<span className="text-white">Faol Sinflar</span>}
              value={stats.active}
              prefix={<GraduationCap className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-purple-400 to-purple-600 border-0">
            <Statistic
              title={<span className="text-white">Jami O'quvchilar</span>}
              value={stats.totalStudents}
              prefix={<Users className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
          </div>
        </Col>
        <Col xs={24} sm={6}>
          <div className="bg-gradient-to-br p-4 rounded-lg from-orange-400 to-orange-600 border-0">
            <Statistic
              title={<span className="text-white">O'rtacha O'quvchi</span>}
              value={stats.avgStudents}
              prefix={<Users className="text-white" />}
              valueStyle={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            />
          </div>
        </Col>
      </Row>

      <div className="space-y-4">
        <Card className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 my-2">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={6}>
              <AntSearch
                placeholder="Sinflarni qidirish..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<Search size={16} />}
              />
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder="Holat"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Barcha holatlar</Option>
                <Option value="active">Faol</Option>
                <Option value="inactive">Nofaol</Option>
              </Select>
            </Col>
            <Col xs={24} sm={4}>
              <Select
                placeholder="Sinf"
                value={gradeFilter}
                onChange={setGradeFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Barcha sinflar</Option>
                <Option value="8">8-sinf</Option>
                <Option value="9">9-sinf</Option>
                <Option value="10">10-sinf</Option>
                <Option value="11">11-sinf</Option>
              </Select>
            </Col>
            <Col xs={24} sm={10}>
              <div className="flex justify-end">
                <Text className="text-slate-600 dark:text-slate-400">
                  Jami: {filteredClasses.length} ta sinf
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Classes Table */}
      <Card
        className="bg-white dark:bg-[#101010] border-slate-200 dark:border-slate-800 mt-4"
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0 text-slate-900 dark:text-white">
              Sinflar Ro'yxati
            </Title>
            <Button
              type="primary"
              size="middle"
              icon={<Plus />}
              onClick={handleCreate}
              className="bg-green-500 hover:bg-green-600 border-green-100"
            >
              Yangi sinf qo'shish
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredClasses}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} ta`
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* Add/Edit Class Modal */}
      <Modal
        title={editingClass ? 'Sinfni tahrirlash' : "Yangi sinf qo'shish"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingClass(null);
        }}
        onOk={() => form.submit()}
        okText="Saqlash"
        cancelText="Bekor qilish"
        okButtonProps={{
          style: { backgroundColor: '#6bd281', border: 'none' }
        }}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Sinf nomi"
                rules={[{ required: true, message: 'Sinf nomini kiriting' }]}
              >
                <Input placeholder="Masalan: 10-A sinf" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
                label="Sinf darajasi"
                rules={[{ required: true, message: 'Sinf darajasini tanlang' }]}
              >
                <Select placeholder="Sinf darajasini tanlang">
                  <Option value={8}>8-sinf</Option>
                  <Option value={9}>9-sinf</Option>
                  <Option value={10}>10-sinf</Option>
                  <Option value={11}>11-sinf</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacher"
                label="Sinf rahbari"
                rules={[{ required: true, message: 'Sinf rahbarini tanlang' }]}
              >
                <Select placeholder="Sinf rahbarini tanlang">
                  {mockTeachers.map((teacher) => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxStudents"
                label="Maksimal o'quvchilar soni"
                rules={[
                  {
                    required: true,
                    message: "Maksimal o'quvchilar sonini kiriting"
                  }
                ]}
              >
                <InputNumber
                  min={1}
                  max={50}
                  placeholder="30"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Holat"
                initialValue="active"
                rules={[{ required: true, message: 'Holatni tanlang' }]}
              >
                <Select>
                  <Option value="active">Faol</Option>
                  <Option value="inactive">Nofaol</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="schedule" label="Dars jadvali">
                <Input placeholder="Masalan: Dushanba, Chorshanba, Juma" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subjects" label="Fanlar">
            <Select mode="multiple" placeholder="Fanlarni tanlang" allowClear>
              {mockSubjects.map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Tavsif">
            <TextArea rows={3} placeholder="Sinf haqida qisqacha ma'lumot..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
