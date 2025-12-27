"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects(user?.id);
  const { tasks, loading: tasksLoading } = useTasks(user?.id);

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to projects changes
    const projectsSubscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `owner_id=eq.${user.id}`
        },
        () => {
          // Projects will auto-update via real-time subscription
        }
      )
      .subscribe();

    // Subscribe to tasks changes
    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `created_by=eq.${user.id}`
        },
        () => {
          // Tasks will auto-update via real-time subscription
        }
      )
      .subscribe();

    return () => {
      projectsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [user?.id]);

  // Calculate stats
  const activeProjects = projects.filter(p => projects).length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;
  
  // Get tasks due today
  const today = new Date().toISOString().split('T')[0];
  const tasksDueToday = tasks.filter(t => 
    t.due_date && t.due_date.split('T')[0] === today && t.status !== 'completed'
  ).length;

  // Get recent tasks (last 5)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const isLoading = projectsLoading || tasksLoading;

  // Calculate completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold bg-linear-to-r from-[#674188] to-[#C3ACD0] bg-clip-text text-transparent">
              Welcome back, {user?.full_name}!
            </h1>
           
          </div>
          <p className="text-[#674188]/70 text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-[#F7EFE5] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#674188] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-[#674188]/70 text-lg">Loading your dashboard...</p>
          </div>
        )}

        {/* Stats Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Projects */}
              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border-2 border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#674188]">
                      {projects.length}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-[#674188] mb-1">Total Projects</h3>
                <p className="text-sm text-[#674188]/60">
                  {activeProjects} active {activeProjects === 1 ? 'project' : 'projects'}
                </p>
              </div>

              {/* Tasks Completed */}
              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border-2 border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#674188]">
                      {completedTasks}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-[#674188] mb-1">Completed</h3>
                <p className="text-sm text-[#674188]/60">
                  out of {tasks.length} total tasks
                </p>
              </div>

              {/* Pending Tasks */}
              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border-2 border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#674188]">
                      {pendingTasks}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-[#674188] mb-1">Pending</h3>
                <p className="text-sm text-[#674188]/60">
                  {tasksDueToday} due today
                </p>
              </div>

              {/* Completion Rate */}
              <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border-2 border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#674188]">
                      {completionRate}%
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-[#674188] mb-1">Success Rate</h3>
                <p className="text-sm text-[#674188]/60">
                  Overall completion
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-white/50 p-6 mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#674188]">Recent Tasks</h2>
                  <span className="px-3 py-1 bg-[#F7EFE5] text-[#674188] rounded-full text-sm font-semibold">
                    Live
                  </span>
                </div>
                <Link 
                  href="/dashboard/task"
                  className="group flex items-center gap-2 text-sm text-[#674188] hover:text-[#C3ACD0] font-semibold transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {recentTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#F7EFE5] to-[#C3ACD0]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#C3ACD0]" />
                  </div>
                  <p className="text-[#674188]/70 text-lg">No tasks yet. Create your first task to get started!</p>
                  <Link 
                    href="/dashboard/projects"
                    className="inline-block mt-4 px-6 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Create Task
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task, idx) => (
                    <div 
                      key={task.id} 
                      className="group flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-[#FFFBF5] to-[#F7EFE5] hover:from-[#F7EFE5] hover:to-[#C3ACD0]/20 border border-[#F7EFE5] hover:border-[#C3ACD0]/50 transition-all duration-300 hover:shadow-md animate-fade-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Status Indicator */}
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-amber-500' :
                          'bg-gray-400'
                        } group-hover:scale-125 transition-transform`}></div>
                        <div className={`absolute inset-0 w-4 h-4 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-amber-500' :
                          'bg-gray-400'
                        } animate-ping opacity-20`}></div>
                      </div>

                      {/* Task Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#674188] truncate group-hover:text-[#C3ACD0] transition-colors">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-[#674188]/60 font-medium">
                            {task.status === 'completed' ? '✅ Completed' :
                             task.status === 'in_progress' ? '⚡ In Progress' :
                             '📋 To Do'}
                          </span>
                          {task.due_date && (
                            <span className="text-xs text-[#674188]/60 font-medium">
                              📅 {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Priority Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                        task.priority === 'high' ? 'bg-red-100' :
                        task.priority === 'medium' ? 'bg-amber-100' :
                        'bg-gray-100'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-600' :
                          task.priority === 'medium' ? 'bg-amber-600' :
                          'bg-gray-600'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Projects Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-white/50 p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#674188]">Active Projects</h2>
                </div>
                <Link 
                  href="/dashboard/projects"
                  className="group flex items-center gap-2 text-sm text-[#674188] hover:text-[#C3ACD0] font-semibold transition-colors"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {projects.filter(p => projects).length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#F7EFE5] to-[#C3ACD0]/20 flex items-center justify-center">
                    <FolderKanban className="w-10 h-10 text-[#C3ACD0]" />
                  </div>
                  <p className="text-[#674188]/70 text-lg mb-4">No active projects. Start a new project!</p>
                  <Link 
                    href="/dashboard/projects"
                    className="inline-block px-6 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Create Project
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter(p => projects)
                    .slice(0, 6)
                    .map((project, idx) => (
                      <Link
                        key={project.id}
                        href={`/dashboard/projects/${project.id}`}
                        className="group p-5 rounded-xl border-2 border-[#F7EFE5] bg-linear-to-br from-white to-[#FFFBF5] hover:border-[#C3ACD0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-[#674188] group-hover:text-[#C3ACD0] transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                          <span className="px-2.5 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-semibold shrink-0">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-[#674188]/60 line-clamp-2 mb-4 min-h-10">
                          {project.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-[#674188]/60 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {tasks.filter(t => t.project_id === project.id).length} tasks
                          </span>
                          <ArrowRight className="w-4 h-4 text-[#C3ACD0] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}