'use client';

import React from 'react';
import { useMailStore } from '@/lib/mailStore';
import { DateRangeFilter, ReadStatusFilter, Category } from '@/types/mail';
import { Filter, Calendar, User, Eye, Sparkles, X } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filterOptions, setFilterOptions, clearFilters } = useMailStore();

  const isFiltered =
    filterOptions.query ||
    filterOptions.sender ||
    filterOptions.dateRange !== 'all' ||
    filterOptions.readStatus !== 'all' ||
    filterOptions.category !== 'all';

  return (
    <div className="bg-slate-100/60 border-b border-slate-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Filter Dropdowns & Inputs */}
      <div className="flex items-center flex-wrap gap-2.5">
        <span className="flex items-center space-x-1 font-bold text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Filters:</span>
        </span>

        {/* Date Range Selector */}
        <div className="relative flex items-center">
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={filterOptions.dateRange}
            onChange={(e) => setFilterOptions({ dateRange: e.target.value as DateRangeFilter })}
            className="bg-white border border-slate-200 rounded-xl pl-8 pr-6 py-1.5 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="10days">Last 10 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Sender Filter Input/Selector */}
        <div className="relative flex items-center">
          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={filterOptions.sender}
            onChange={(e) => setFilterOptions({ sender: e.target.value })}
            placeholder="Filter by sender (e.g. Sarah)..."
            className="bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-700 font-medium placeholder-slate-400 w-44 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Read Status Selector */}
        <div className="relative flex items-center">
          <Eye className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={filterOptions.readStatus}
            onChange={(e) => setFilterOptions({ readStatus: e.target.value as ReadStatusFilter })}
            className="bg-white border border-slate-200 rounded-xl pl-8 pr-6 py-1.5 text-slate-700 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="all">All Read Status</option>
            <option value="unread">Only Unread</option>
            <option value="read">Only Read</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
          {(['all', 'primary', 'updates'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterOptions({ category: cat })}
              className={`px-3 py-1 rounded-lg capitalize font-bold transition-all ${
                filterOptions.category === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Active Badge & Clear Action */}
      {isFiltered && (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
            <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
            <span>AI / Filter Active</span>
          </div>
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  );
};
