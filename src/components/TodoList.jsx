import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Paper,
  Grid, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Avatar,
  Divider,
  InputAdornment,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Add, 
  Sort, 
  CalendarToday, 
  AccessTime, 
  CheckCircle, 
  FilterList,
  EmojiEmotions,
  Info
} from '@mui/icons-material';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

const TodoList = () => {
  const theme = useTheme();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt'); // 기본 정렬: 등록순
  const [isLoading, setIsLoading] = useState(false);

  // Firestore에서 모든 할 일 가져오기
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'todos'));
      const todoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // 정렬 적용
      sortTodos(todoList, sortBy);
    } catch (error) {
      console.error('할 일을 가져오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 함수
  const sortTodos = (todoList, sortType) => {
    let sortedList = [...todoList];
    
    switch (sortType) {
      case 'title':
        // 이름순 정렬
        sortedList.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        break;
      case 'deadline':
        // 마감일순 정렬 (없는 항목은 맨 뒤로)
        sortedList.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        });
        break;
      case 'createdAt':
      default:
        // 등록순 정렬 (최신순)
        sortedList.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        break;
    }
    
    setTodos(sortedList);
  };

  // 정렬 방식 변경 핸들러
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    sortTodos(todos, newSortBy);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 마감 상태에 따른 색상 반환
  const getDeadlineStatus = (deadline) => {
    if (!deadline) return { color: 'default', label: '마감일 없음' };
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    
    if (isBefore(deadlineDate, today)) {
      return { color: 'error', label: '마감일 지남', icon: <AccessTime fontSize="small" /> };
    }
    
    if (isBefore(deadlineDate, addDays(today, 3))) {
      return { color: 'warning', label: '마감 임박', icon: <AccessTime fontSize="small" /> };
    }
    
    return { color: 'success', label: '여유 있음', icon: <CheckCircle fontSize="small" /> };
  };

  // 할 일 추가
  const handleAddTodo = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'todos'), {
        title,
        description,
        deadline,
        createdAt: new Date()
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      fetchTodos();
    } catch (error) {
      console.error('할 일을 추가하는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 할 일 수정
  const handleUpdateTodo = async () => {
    if (!title.trim() || !currentId) return;

    setIsLoading(true);
    try {
      const todoRef = doc(db, 'todos', currentId);
      await updateDoc(todoRef, {
        title,
        description,
        deadline,
        updatedAt: new Date()
      });
      setTitle('');
      setDescription('');
      setDeadline('');
      setEditMode(false);
      setCurrentId('');
      fetchTodos();
    } catch (error) {
      console.error('할 일을 수정하는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 할 일 삭제
  const handleDeleteTodo = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'todos', id));
      fetchTodos();
    } catch (error) {
      console.error('할 일을 삭제하는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 모드 활성화
  const enableEditMode = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setDeadline(todo.deadline || '');
    setEditMode(true);
    setCurrentId(todo.id);
  };

  // 할 일 상세보기
  const handleViewDetails = (todo) => {
    setCurrentId(todo.id);
    setOpenDialog(true);
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      handleUpdateTodo();
    } else {
      handleAddTodo();
    }
  };

  // 이모티콘 랜덤 생성
  const getRandomEmoji = () => {
    const emojis = ['😊', '🚀', '🔥', '✨', '📝', '💫', '⚡', '🌈', '🎯', '💡'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mx: 'auto' }}>
      {isLoading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
      
      <Box sx={{ textAlign: 'center', mb: 5, mx: 'auto' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #5568FE 30%, #818BFE 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          ToDo.
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          할 일을 효율적으로 관리하고 마감일을 놓치지 마세요.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center' }}>
        {/* 왼쪽: 할 일 추가/수정 폼 */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, maxWidth: '600px' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%', 
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                boxShadow: theme.shadows[4],
                borderColor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                {editMode ? <Edit /> : <Add />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {editMode ? '할 일 수정하기' : '새 할 일 추가하기'}
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="할 일의 제목을 입력하세요"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmojiEmotions color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="세부사항"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  placeholder="할 일에 대한 세부 사항을 입력하세요"
                />
                
                <TextField
                  label="마감 기한"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  variant="contained"
                  color={editMode ? "success" : "primary"}
                  type="submit"
                  fullWidth
                  size="large"
                  startIcon={editMode ? <Edit /> : <Add />}
                  sx={{ mt: 2 }}
                >
                  {editMode ? '수정하기' : '추가하기'}
                </Button>
                
                {editMode && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setDeadline('');
                      setEditMode(false);
                      setCurrentId('');
                    }}
                    fullWidth
                  >
                    취소
                  </Button>
                )}
              </Box>
            </form>
          </Paper>
        </Box>

        {/* 오른쪽: 할 일 목록 */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, maxWidth: '600px' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                boxShadow: theme.shadows[4],
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
              overflow: 'visible'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.secondary.main, 
                    width: 40, 
                    height: 40, 
                    mr: 2,
                    boxShadow: `0 4px 10px ${alpha(theme.palette.secondary.main, 0.3)}`
                  }}
                >
                  <FilterList />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  할 일 목록
                </Typography>
              </Box>
              
              <FormControl 
                sx={{ 
                  width: '100%', 
                  maxWidth: 200, 
                  mt: 2, 
                  alignSelf: 'flex-end'
                }} 
                size="small"
              >
                <InputLabel id="sort-select-label">정렬 기준</InputLabel>
                <Select
                  labelId="sort-select-label"
                  value={sortBy}
                  label="정렬 기준"
                  onChange={handleSortChange}
                  size="small"
                  startAdornment={<Sort sx={{ mr: 1, ml: -0.5 }} fontSize="small" />}
                >
                  <MenuItem value="createdAt">등록순</MenuItem>
                  <MenuItem value="title">이름순</MenuItem>
                  <MenuItem value="deadline">마감일순</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ mb: 3 }} />

            <List sx={{ width: '100%', overflow: 'visible' }}>
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <Paper key={todo.id} elevation={2} sx={{ mb: 2 }}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" onClick={() => enableEditMode(todo)}>
                            <Edit />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteTodo(todo.id)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={todo.title}
                        secondary={
                          <span>
                            {todo.description && <span style={{ display: 'block' }}>내용: {todo.description.substring(0, 50)}{todo.description.length > 50 ? '...' : ''}</span>}
                            {todo.deadline && <span style={{ display: 'block', fontSize: '0.75rem' }}>마감일: {todo.deadline}</span>}
                            <Button size="small" onClick={() => handleViewDetails(todo)}>자세히 보기</Button>
                          </span>
                        }
                      />
                    </ListItem>
                  </Paper>
                ))
              ) : (
                <Typography align="center">할 일이 없습니다. 새로운 할 일을 추가해보세요!</Typography>
              )}
            </List>
          </Paper>
        </Box>
      </Box>

      {/* 할 일 상세보기 다이얼로그 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {todos.find(todo => todo.id === currentId) && (
          <>
            <DialogTitle>{todos.find(todo => todo.id === currentId).title}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>세부사항:</Typography>
              <Typography paragraph>
                {todos.find(todo => todo.id === currentId).description || '세부사항이 없습니다.'}
              </Typography>
              
              {todos.find(todo => todo.id === currentId).deadline && (
                <>
                  <Typography variant="subtitle1" gutterBottom>마감 기한:</Typography>
                  <Typography>
                    {todos.find(todo => todo.id === currentId).deadline}
                  </Typography>
                </>
              )}
              
              {todos.find(todo => todo.id === currentId).createdAt && (
                <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                  생성일: {format(todos.find(todo => todo.id === currentId).createdAt.toDate(), 'yyyy-MM-dd HH:mm')}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>닫기</Button>
              <Button onClick={() => {
                enableEditMode(todos.find(todo => todo.id === currentId));
                setOpenDialog(false);
              }}>
                수정
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default TodoList; 