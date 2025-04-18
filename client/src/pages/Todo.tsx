import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import theme from '../styles/theme';
import Navbar from '../components/Navbar';
import GradientButton from '../components/GradientButton';
import { useUser } from '../contexts/UserContext';
import { HabitTask, HabitCategory } from '../types'; // Assuming HabitCategory is also needed
import { PlusCircle, Calendar, Clock } from 'lucide-react'; // Added icons

/**
 * Interface for the state of the custom task form.
 */
interface CustomTaskFormState {
  name: string;
  category: string; // Could be a category ID or name
}

/**
 * Interface for the combined habit category structure including custom tasks.
 */
interface DisplayHabitCategory extends HabitCategory {
  customTasks?: HabitTask[];
}

/**
 * Initial state for the custom task form.
 */
const INITIAL_CUSTOM_TASK_STATE: CustomTaskFormState = {
  name: '',
  category: '', // Default to the first category or an empty string
};

// --- Styled Components ---

/**
 * Main container for the Todo page.
 */
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.light};
`;

/**
 * Wrapper for the main content area, setting max-width and padding.
 */
const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem 2rem; /* Adjusted padding for Navbar */

  @media (min-width: ${theme.breakpoints.md}) {
    padding: 5rem 2rem 3rem;
  }
`;

/**
 * Header section for the page title and description.
 */
const PageHeader = styled.div`
  margin-bottom: 2.5rem; /* Increased margin */
  padding-left: 1rem; /* Add padding for accent line */
  position: relative;

   /* Accent line */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 0.25rem;
    background: ${theme.gradients.primary};
    border-radius: ${theme.borderRadius.full};
  }

  h1 {
    font-size: 2rem; /* Adjusted size */
    font-weight: ${theme.fontWeight.bold};
    margin-bottom: 0.75rem; /* Adjusted margin */
  }

  p {
    color: ${theme.colors.gray[600]};
    font-size: 1.1rem; /* Adjusted size */
    max-width: 600px; /* Limit width */
  }
`;

/**
 * Span to apply gradient styling to text.
 */
const GradientText = styled.span`
  /* Updated gradient to match theme */
  background: linear-gradient(90deg, #C27AFF, #FFA6CE, #F49C82, #D9983F, #C6B420);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent; /* Standard property */
  font-weight: 700; /* Keep bold */
`;


/**
 * Container for category tabs, allowing horizontal scrolling.
 */
const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto; /* Enable horizontal scroll */
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  padding-bottom: 0.75rem; /* Space for scrollbar */
  position: relative; /* For fade-out effect */

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
    border-radius: ${theme.borderRadius.full};
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.pink}80; /* Semi-transparent pink */
    border-radius: ${theme.borderRadius.full};
  }

  /* Right fade-out effect for scroll indication */
  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: calc(100% - 0.75rem); /* Adjust height to avoid covering scrollbar */
    width: 40px;
    background: linear-gradient(to right, transparent, ${theme.colors.light});
    pointer-events: none;
  }
`;

/**
 * Individual category tab button.
 * Changes style based on the `$active` prop.
 */
const CategoryTab = styled.button<{ $active: boolean }>`
  padding: 0.85rem 1.5rem;
  border-radius: ${theme.borderRadius.full};
  font-weight: ${theme.fontWeight.medium};
  font-size: 0.95rem;
  white-space: nowrap; /* Prevent text wrapping */
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;

  ${({ $active }) => $active
    ? `
      background: linear-gradient(135deg, #EDC9FF, #FED4E7, #F2B79F, #E5B769, #D8CC34); /* Gradient background */
      color: ${theme.colors.gray[900]}; /* Dark text for contrast */
      font-weight: ${theme.fontWeight.bold};
      box-shadow: 0 4px 12px rgba(242, 183, 159, 0.25); /* Subtle shadow */
      transform: translateY(-2px); /* Slight lift effect */
      border: 1px solid rgba(255, 255, 255, 0.5); /* Subtle white border */
    `
    : `
      background-color: ${theme.colors.white};
      color: ${theme.colors.gray[700]};
      box-shadow: ${theme.shadows.sm};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
        color: ${theme.colors.primary.pink}; /* Highlight on hover */
      }
    `
  }
`;

/**
 * Container for the tasks list of the selected category.
 */
const TasksContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  overflow: hidden; /* Ensures content respects border radius */
`;

/**
 * Header within the TasksContainer, showing category title and streak.
 */
const TasksHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.25rem;
    font-weight: ${theme.fontWeight.semibold};
    display: flex;
    align-items: center;

    img { /* Category icon */
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 0.75rem;
      border-radius: ${theme.borderRadius.full};
      background-color: ${theme.colors.gray[100]}; /* Placeholder background */
      object-fit: cover; /* Ensure icon fits well */
    }
  }

  .streak {
    display: flex;
    align-items: center;
    font-size: 0.9rem; /* Slightly larger */
    color: ${theme.colors.gray[700]}; /* Darker color */
    background-color: ${theme.colors.gray[100]}; /* Background for emphasis */
    padding: 0.4rem 0.8rem;
    border-radius: ${theme.borderRadius.full};

    i { /* FontAwesome icon */
      color: ${theme.colors.status.excellent}; /* Use theme color */
      margin-right: 0.375rem;
      font-size: 0.9em; /* Adjust icon size */
    }
    span {
      font-weight: ${theme.fontWeight.medium};
    }
  }
`;

/**
 * Container for the list of tasks.
 */
const TasksList = styled.div`
  padding: 1.5rem;
`;

/**
 * Represents a single task item in the list.
 * Includes checkbox, task details, and points.
 * Uses Framer Motion for animations.
 */
const TaskItem = styled(motion.div)<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${theme.colors.white};
  margin-bottom: 1.25rem;
  /* Subtle shadow, slightly increased */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${theme.colors.gray[100]};
  transition: all 0.2s ease-in-out;
  opacity: ${({ $completed }) => $completed ? 0.7 : 1}; /* Dim completed tasks */

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  .checkbox {
    flex-shrink: 0;
    margin-right: 1rem; /* Ensure spacing */

    input {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: ${theme.borderRadius.md};
      accent-color: ${theme.colors.primary.pink}; /* Checkbox color */
      cursor: pointer;
      border: 1px solid ${theme.colors.gray[300]}; /* Add border */
    }
  }

  .content {
    flex-grow: 1; /* Take remaining space */

    .task-name {
      font-weight: ${theme.fontWeight.medium};
      color: ${({ $completed }) => $completed ? theme.colors.gray[500] : theme.colors.gray[800]};
      margin-bottom: 0.25rem;
      font-size: 1.05rem;
      text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
    }

    .task-time {
      font-size: 0.8rem;
      color: ${theme.colors.gray[500]};
      display: flex;
      align-items: center;

      /* Using Lucide icon component */
      .clock-icon {
        width: 0.8em;
        height: 0.8em;
        margin-right: 0.35rem;
        opacity: 0.8;
      }
    }
  }

  .points {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: ${theme.colors.gray[700]};
    font-weight: ${theme.fontWeight.semibold};
    /* Updated gradient background */
    background: linear-gradient(to right, rgba(242, 183, 159, 0.1), rgba(229, 183, 105, 0.1));
    padding: 0.5rem 0.75rem;
    border-radius: ${theme.borderRadius.full};
    margin-left: 1rem; /* Ensure spacing */

    i { /* FontAwesome icon for points */
      color: ${theme.colors.secondary.gold};
      margin-right: 0.375rem;
      font-size: 0.9em; /* Adjust icon size */
    }
  }
`;

/**
 * Container for the "Add Custom Task" section.
 */
const AddTaskSection = styled.div`
  padding: 1.5rem;
  border-top: 1px dashed ${theme.colors.gray[200]}; /* Use dashed border */
`;

/**
 * Button to reveal the custom task form.
 */
const AddTaskButton = styled.button`
  background-color: rgba(242, 183, 159, 0.05); /* Very light background */
  border: 2px dashed rgba(242, 183, 159, 0.3); /* Dashed border */
  border-radius: ${theme.borderRadius.lg};
  width: 100%;
  padding: 1rem;
  color: ${theme.colors.gray[600]};
  font-weight: ${theme.fontWeight.medium};
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  .plus-icon { /* Using Lucide icon */
    width: 1.1em;
    height: 1.1em;
    margin-right: 0.5rem;
    opacity: 0.8;
  }

  &:hover {
    background-color: rgba(242, 183, 159, 0.1);
    border-color: rgba(242, 183, 159, 0.5);
    color: ${theme.colors.gray[800]};
  }
`;

/**
 * Form for adding a custom task.
 */
const AddTaskForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  input, select {
    padding: 0.75rem;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.gray[300]};
    font-size: 0.9rem;

    &:focus {
      border-color: ${theme.colors.primary.pink};
      outline: none;
      box-shadow: 0 0 0 2px ${theme.colors.primary.pink}33; /* Focus ring */
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
`;

/**
 * Button to cancel adding a task.
 */
const CancelButton = styled.button`
  background-color: ${theme.colors.gray[100]};
  color: ${theme.colors.gray[700]};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: 0.6rem 1.2rem;
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.gray[200]};
  }
`;

/**
 * Empty state message when no tasks are present.
 */
const EmptyTasksMessage = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: ${theme.colors.gray[500]};

  .calendar-icon { /* Using Lucide icon */
    width: 3rem;
    height: 3rem;
    opacity: 0.4;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: ${theme.fontWeight.medium};
    color: ${theme.colors.gray[700]};
    margin-bottom: 0.5rem;
  }
`;

// --- Component ---

/**
 * Todo Page Component
 * Displays habit categories and their associated tasks.
 * Allows users to mark tasks as complete and add custom tasks.
 */
const Todo: React.FC = () => {
  const { user, habitCategories, updateUser } = useUser();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [displayCategories, setDisplayCategories] = useState<DisplayHabitCategory[]>([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [customTask, setCustomTask] = useState<CustomTaskFormState>(INITIAL_CUSTOM_TASK_STATE);
  const firstLoad = useRef(true); // Ref to track initial load

  // Initialize display categories and selected category
  useEffect(() => {
    if (habitCategories.length > 0 && firstLoad.current) {
        // Map categories and add an empty customTasks array initially
        const initialDisplayCategories = habitCategories.map(cat => ({
            ...cat,
            customTasks: [],
        }));
        setDisplayCategories(initialDisplayCategories);

        // Set the first category as selected and initialize custom task form category
        const firstCategory = initialDisplayCategories[0];
        setSelectedCategoryId(firstCategory.id);
        setCustomTask(prev => ({ ...prev, category: firstCategory.id }));
        firstLoad.current = false; // Mark initial load as complete
    } else if (!firstLoad.current) {
        // On subsequent updates (e.g., task toggle), just update displayCategories
        // Preserve existing custom tasks
        setDisplayCategories(prevDisplay =>
            habitCategories.map(cat => {
                const existing = prevDisplay.find(dc => dc.id === cat.id);
                return {
                    ...cat,
                    customTasks: existing?.customTasks || [], // Keep existing custom tasks
                };
            })
        );
    }
  }, [habitCategories]); // Depend only on habitCategories

  /**
   * Handles selecting a different habit category.
   * @param categoryId - The ID of the category to select.
   */
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCustomTask(prev => ({ ...prev, category: categoryId })); // Update form category
    setShowAddTaskForm(false); // Hide form when switching categories
  };

  /**
   * Handles toggling the completion status of a task.
   * Updates the user context with the modified habit categories.
   * @param categoryId - The ID of the category containing the task.
   * @param taskId - The ID of the task to toggle.
   * @param isCustom - Whether the task is a custom task.
   */
  const handleTaskToggle = (categoryId: string, taskId: string, isCustom: boolean = false) => {
    const updatedCategories = displayCategories.map(category => {
      if (category.id === categoryId) {
        const taskListKey = isCustom ? 'customTasks' : 'tasks';
        const updatedTasks = (category[taskListKey] || []).map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        return { ...category, [taskListKey]: updatedTasks };
      }
      return category;
    });

    // Update local state immediately for responsiveness
    setDisplayCategories(updatedCategories);

    // Prepare data for context update (excluding customTasks)
    const categoriesForContext = updatedCategories.map(({ customTasks, ...rest }) => rest);
    updateUser({ ...user, habitCategories: categoriesForContext });
  };

  /**
   * Handles input changes in the custom task form.
   * @param e - The input change event.
   */
  const handleCustomTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomTask(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles submitting the custom task form.
   * Adds the new custom task to the selected category.
   * @param e - The form submit event.
   */
  const handleCustomTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTask.name || !customTask.category) return; // Basic validation

    const newTask: HabitTask = {
      id: `custom-${Date.now()}-${Math.random()}`, // Unique ID for custom task
      name: customTask.name,
      points: 10, // Default points for custom tasks
      completed: false,
      time: null, // Custom tasks might not have a specific time
    };

    setDisplayCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === customTask.category
          ? { ...category, customTasks: [...(category.customTasks || []), newTask] }
          : category
      )
    );

    // Reset form and hide it
    setCustomTask(INITIAL_CUSTOM_TASK_STATE);
    setShowAddTaskForm(false);
  };

  // Find the currently selected category object
  const selectedCategory = displayCategories.find(cat => cat.id === selectedCategoryId);
  const allTasks = [
      ...(selectedCategory?.tasks || []),
      ...(selectedCategory?.customTasks || [])
  ];

  return (
    <PageContainer>
      <Navbar activeTab="todo" />

      <MainContent>
        <PageHeader>
          <h1>Today's <GradientText>Quests</GradientText></h1>
          <p>Complete your daily tasks to earn points and build streaks!</p>
        </PageHeader>

        {/* Category Selection Tabs */}
        {displayCategories.length > 0 ? (
          <CategoryTabs>
            {displayCategories.map(category => (
              <CategoryTab
                key={category.id}
                $active={selectedCategoryId === category.id}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </CategoryTab>
            ))}
          </CategoryTabs>
        ) : (
           <p>Loading categories...</p> /* Optional loading state */
        )}

        {/* Tasks Display Area */}
        {selectedCategory ? (
          <TasksContainer>
            <TasksHeader>
              <h2>
                <img src={selectedCategory.icon} alt={`${selectedCategory.name} icon`} />
                {selectedCategory.name}
              </h2>
              <div className="streak">
                <i className="fas fa-fire"></i>
                <span>{selectedCategory.streak} Day Streak</span>
              </div>
            </TasksHeader>

            <TasksList>
              <AnimatePresence>
                {allTasks.length > 0 ? (
                    allTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        $completed={task.completed}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        layout // Animate layout changes (e.g., reordering)
                      >
                        <div className="checkbox">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleTaskToggle(selectedCategoryId, task.id, !!selectedCategory.customTasks?.some(ct => ct.id === task.id))}
                            aria-label={`Mark task ${task.name} as ${task.completed ? 'incomplete' : 'complete'}`}
                          />
                        </div>
                        <div className="content">
                          <div className="task-name">{task.name}</div>
                          {task.time && (
                            <div className="task-time">
                              <Clock className="clock-icon" /> {task.time}
                            </div>
                          )}
                        </div>
                        <div className="points">
                          <i className="fas fa-star"></i> {task.points} pts
                        </div>
                      </TaskItem>
                    ))
                ) : (
                  <EmptyTasksMessage>
                    <Calendar className="calendar-icon" />
                    <h3>No quests for today!</h3>
                    <p>Looks like this category is clear, or you haven't added any tasks yet.</p>
                  </EmptyTasksMessage>
                )}
              </AnimatePresence>
            </TasksList>

            {/* Add Custom Task Section */}
            <AddTaskSection>
              {!showAddTaskForm ? (
                <AddTaskButton onClick={() => setShowAddTaskForm(true)}>
                  <PlusCircle className="plus-icon" /> Add Custom Quest
                </AddTaskButton>
              ) : (
                <AddTaskForm
                  onSubmit={handleCustomTaskSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    name="name"
                    value={customTask.name}
                    onChange={handleCustomTaskChange}
                    placeholder="Enter custom quest name..."
                    required
                    aria-label="Custom quest name"
                  />
                  {/* Category selection could be added here if needed */}
                  {/* <select name="category" value={customTask.category} onChange={handleCustomTaskChange}>...</select> */}
                  <div className="form-actions">
                    <CancelButton type="button" onClick={() => setShowAddTaskForm(false)}>
                      Cancel
                    </CancelButton>
                    <GradientButton type="submit">
                      Add Quest
                    </GradientButton>
                  </div>
                </AddTaskForm>
              )}
            </AddTaskSection>
          </TasksContainer>
        ) : (
           <p>Select a category to view tasks.</p> /* Message if no category is selected */
        )}
      </MainContent>
    </PageContainer>
  );
};

export default Todo;
