import type { BulkSetupData } from '@/lib/api-types';
import { Result, succeed, fail } from '@/lib/result';

export interface BulkSetupResult {
  success: boolean;
  message: string;
  count: number;
  type: string;
}

export class BulkSetupService {
  /**
   * Parse CSV data and validate it for bulk setup
   */
  static parseCsvData(csvText: string): Result<BulkSetupData[]> {
    try {
      const lines = csvText.split('\n');
      if (lines.length < 2) {
        return fail(
          'CSV file must have at least a header row and one data row'
        );
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const data: BulkSetupData[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const item = this.parseCsvRow(headers, values);
          data.push(item);
        }
      }

      if (data.length === 0) {
        return fail('No valid data rows found in CSV');
      }

      return succeed(data);
    } catch {
      return fail('Failed to parse CSV file');
    }
  }

  /**
   * Parse a single CSV row into BulkSetupData
   */
  private static parseCsvRow(
    headers: string[],
    values: string[]
  ): BulkSetupData {
    const item: Record<string, string | number | boolean | string[]> = {};

    headers.forEach((header, index) => {
      let value = values[index] || '';

      // Handle quoted values (e.g., "programming,clean-code")
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Parse specific fields based on type
      if (this.isNumericField(header)) {
        item[header] = parseInt(value) || 0;
      } else if (header === 'done') {
        item[header] = value.toLowerCase() === 'true';
      } else if (header === 'tags') {
        item[header] = value ? value.split(',').map(t => t.trim()) : [];
      } else {
        item[header] = value;
      }
    });

    // Ensure required fields have defaults based on type
    const result: BulkSetupData = {
      title: (item.title as string) || 'Untitled',
      category: (item.category as string) || 'Uncategorized',
      ...item,
    };

    return result;
  }

  /**
   * Check if a field should be parsed as numeric
   */
  private static isNumericField(field: string): boolean {
    const numericFields = [
      'xp',
      'total_pages',
      'current_page',
      'total_units',
      'completed_units',
    ];
    return numericFields.includes(field);
  }

  /**
   * Validate bulk setup data with detailed feedback
   * Returns validation results with specific error details
   */
  static validateBulkSetupData(
    data: BulkSetupData[],
    type: 'quests' | 'books' | 'courses'
  ): Result<{ valid: boolean; errors: string[]; warnings: string[] }> {
    if (data.length === 0) {
      return fail('No data to validate');
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const rowNumber = i + 1;

      // Essential fields that must be present
      if (!item.title || item.title.trim() === '') {
        errors.push(`Row ${rowNumber}: Missing title`);
      }

      if (!item.category || item.category.trim() === '') {
        errors.push(`Row ${rowNumber}: Missing category`);
      }

      // Type-specific validation for required fields
      if (type === 'quests') {
        if (typeof item.xp !== 'number' || item.xp < 0) {
          errors.push(
            `Row ${rowNumber}: Invalid XP value (must be non-negative number)`
          );
        }
        if (!item.type || !['topic', 'project', 'bonus'].includes(item.type)) {
          errors.push(
            `Row ${rowNumber}: Invalid type (must be topic, project, or bonus)`
          );
        }
      }

      // Optional fields validation (only if provided)
      if (type === 'books') {
        if (item.total_pages !== undefined && item.total_pages < 0) {
          errors.push(`Row ${rowNumber}: Total pages must be non-negative`);
        }
        if (item.current_page !== undefined && item.current_page < 0) {
          errors.push(`Row ${rowNumber}: Current page must be non-negative`);
        }
        if (
          item.status &&
          !['backlog', 'reading', 'finished'].includes(item.status)
        ) {
          errors.push(
            `Row ${rowNumber}: Invalid status (must be backlog, reading, or finished)`
          );
        }
        if (
          item.total_pages !== undefined &&
          item.current_page !== undefined &&
          item.current_page > item.total_pages
        ) {
          warnings.push(
            `Row ${rowNumber}: Current page (${item.current_page}) is greater than total pages (${item.total_pages})`
          );
        }
      }

      if (type === 'courses') {
        if (item.total_units !== undefined && item.total_units < 0) {
          errors.push(`Row ${rowNumber}: Total units must be non-negative`);
        }
        if (item.completed_units !== undefined && item.completed_units < 0) {
          errors.push(`Row ${rowNumber}: Completed units must be non-negative`);
        }
        if (
          item.status &&
          !['backlog', 'learning', 'finished'].includes(item.status)
        ) {
          errors.push(
            `Row ${rowNumber}: Invalid status (must be backlog, learning, or finished)`
          );
        }
        if (
          item.total_units !== undefined &&
          item.completed_units !== undefined &&
          item.completed_units > item.total_units
        ) {
          warnings.push(
            `Row ${rowNumber}: Completed units (${item.completed_units}) is greater than total units (${item.total_units})`
          );
        }
      }

      // URL validation for courses
      if (type === 'courses' && item.url && !this.isValidUrl(item.url)) {
        warnings.push(`Row ${rowNumber}: URL format may be invalid`);
      }
    }

    const valid = errors.length === 0;
    return succeed({ valid, errors, warnings });
  }

  /**
   * Simple URL validation
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate CSV template for a specific type
   * Includes all available columns - only title and category are required
   */
  static generateCsvTemplate(type: 'quests' | 'books' | 'courses'): {
    content: string;
    filename: string;
  } {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'quests':
        // All available fields: title, description, xp, type, category, done
        csvContent =
          'title,description,xp,type,category,done\nLearn React Hooks,Master the fundamentals of React Hooks including useState, useEffect, and custom hooks,100,topic,Frontend Development,false\nBuild a Todo App,Create a complete todo application using React and modern web technologies,150,project,Frontend Development,false\nMaster TypeScript,Learn TypeScript from basics to advanced concepts including generics and utility types,200,topic,Programming Languages,false';
        filename = 'quests_template.csv';
        break;
      case 'books':
        // All available fields: title, category, author, description, total_pages, current_page, status, tags
        csvContent =
          'title,category,author,description,total_pages,current_page,status,tags\nClean Code,Software Engineering,Robert C. Martin,A handbook of agile software craftsmanship,464,0,backlog,"programming,clean-code"\nDesign Patterns,Software Engineering,Erich Gamma et al.,Elements of Reusable Object-Oriented Software,416,0,backlog,"design-patterns,architecture"';
        filename = 'books_template.csv';
        break;
      case 'courses':
        // All available fields: title, category, platform, url, description, total_units, completed_units, status, tags
        csvContent =
          'title,category,platform,url,description,total_units,completed_units,status,tags\nComplete React Developer,Frontend Development,Udemy,https://udemy.com/react-complete-guide,Learn React from scratch to advanced concepts,20,0,backlog,"react,javascript,frontend"\nNode.js Complete Guide,Backend Development,Udemy,https://udemy.com/nodejs-complete-guide,Master Node.js backend development,25,0,backlog,"nodejs,javascript,backend"';
        filename = 'courses_template.csv';
        break;
    }

    return { content: csvContent, filename };
  }

  /**
   * Download a file to the user's device
   */
  static downloadFile(
    content: string,
    filename: string,
    mimeType: string = 'text/csv;charset=utf-8;'
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
