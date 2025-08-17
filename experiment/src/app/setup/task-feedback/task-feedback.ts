import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TaskData {
  material: number | null;
  spade: number | null;
}

interface FeedbackData {
  angularExperience: string;
  materialExperience: string;
  completedTasks: {
    button: boolean;
    input: boolean;
    dropdown: boolean;
  };
  times: {
    button: TaskData;
    input: TaskData;
    dropdown: TaskData;
  };
  completion: {
    button: TaskData;
    input: TaskData;
    dropdown: TaskData;
  };
  difficulty: {
    button: TaskData;
    input: TaskData;
    dropdown: TaskData;
  };
  qualitative: {
    mostChallenging: string;
    easiestAspect: string;
    materialFrustrations: string;
    spadeFrustrations: string;
  };
  preferences: {
    preferredApproach: string;
    reasoning: string;
    moreIntuitive: string;
  };
  improvements: {
    material: string;
    spade: string;
  };
  additionalComments: string;
  submissionTimestamp: string;
}

@Component({
  selector: 'app-task-feedback',
  imports: [FormsModule, CommonModule],
  templateUrl: './task-feedback.html',
  styleUrl: './task-feedback.scss',
})
export class TaskFeedback implements OnInit {
  feedback: FeedbackData = {
    angularExperience: '',
    materialExperience: '',
    completedTasks: {
      button: false,
      input: false,
      dropdown: false,
    },
    times: {
      button: { material: null, spade: null },
      input: { material: null, spade: null },
      dropdown: { material: null, spade: null },
    },
    completion: {
      button: { material: null, spade: null },
      input: { material: null, spade: null },
      dropdown: { material: null, spade: null },
    },
    difficulty: {
      button: { material: null, spade: null },
      input: { material: null, spade: null },
      dropdown: { material: null, spade: null },
    },
    qualitative: {
      mostChallenging: '',
      easiestAspect: '',
      materialFrustrations: '',
      spadeFrustrations: '',
    },
    preferences: {
      preferredApproach: '',
      reasoning: '',
      moreIntuitive: '',
    },
    improvements: {
      material: '',
      spade: '',
    },
    additionalComments: '',
    submissionTimestamp: '',
  };

  ngOnInit() {
    // Load saved feedback from localStorage if available
    this.loadSavedFeedback();

    // Auto-save feedback periodically
    setInterval(() => {
      this.saveFeedbackToLocalStorage();
    }, 30000); // Save every 30 seconds
  }

  hasCompletedTasks(): boolean {
    return (
      this.feedback.completedTasks.button ||
      this.feedback.completedTasks.input ||
      this.feedback.completedTasks.dropdown
    );
  }

  private loadSavedFeedback(): void {
    try {
      const saved = localStorage.getItem('experiment-feedback');
      if (saved) {
        const parsedFeedback = JSON.parse(saved);
        this.feedback = { ...this.feedback, ...parsedFeedback };
      }
    } catch (error) {
      console.warn('Could not load saved feedback:', error);
    }
  }

  private saveFeedbackToLocalStorage(): void {
    try {
      localStorage.setItem(
        'experiment-feedback',
        JSON.stringify(this.feedback)
      );
    } catch (error) {
      console.warn('Could not save feedback to localStorage:', error);
    }
  }

  exportFeedback(): void {
    // Update timestamp
    this.feedback.submissionTimestamp = new Date().toISOString();

    // Create and clean the data for export
    const exportData = this.cleanFeedbackData();

    // Create download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `experiment-feedback-${Date.now()}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    // Show success message
    this.showNotification('Feedback successfully downloaded as JSON file!');
  }

  async copyToClipboard(): Promise<void> {
    // Update timestamp
    this.feedback.submissionTimestamp = new Date().toISOString();

    // Create and clean the data for export
    const exportData = this.cleanFeedbackData();

    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      this.showNotification('Feedback copied to clipboard!');
    } catch (error) {
      console.error('Could not copy to clipboard:', error);

      // Fallback: Create a text area for manual copy
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(exportData, null, 2);
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';

      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        this.showNotification('Feedback copied to clipboard!');
      } catch (fallbackError) {
        this.showNotification('Copy failed. Please copy manually.', 'error');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }

  private cleanFeedbackData(): any {
    const cleaned = JSON.parse(JSON.stringify(this.feedback));

    // Remove uncompleted task data to avoid confusion
    if (!this.feedback.completedTasks.button) {
      delete cleaned.times.button;
      delete cleaned.completion.button;
      delete cleaned.difficulty.button;
    }

    if (!this.feedback.completedTasks.input) {
      delete cleaned.times.input;
      delete cleaned.completion.input;
      delete cleaned.difficulty.input;
    }

    if (!this.feedback.completedTasks.dropdown) {
      delete cleaned.times.dropdown;
      delete cleaned.completion.dropdown;
      delete cleaned.difficulty.dropdown;
    }

    // Add metadata for analysis
    cleaned.metadata = {
      experimentVersion: '1.0',
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
      },
      completedTasksCount: Object.values(this.feedback.completedTasks).filter(
        Boolean
      ).length,
      totalTimeSpent: this.calculateTotalTime(),
      exportedAt: new Date().toISOString(),
    };

    return cleaned;
  }

  private calculateTotalTime(): number {
    let total = 0;

    Object.values(this.feedback.times).forEach((task) => {
      if (task.material) total += task.material;
      if (task.spade) total += task.spade;
    });

    return total;
  }

  private showNotification(
    message: string,
    type: 'success' | 'error' = 'success'
  ): void {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#48bb78' : '#e53e3e'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-weight: 500;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Helper method to validate completion
  isValidForSubmission(): boolean {
    if (!this.hasCompletedTasks()) {
      return false;
    }

    // Check that required fields are filled
    if (!this.feedback.angularExperience || !this.feedback.materialExperience) {
      return false;
    }

    // Check that time data is provided for completed tasks
    const completedTasks = Object.entries(this.feedback.completedTasks)
      .filter(([_, completed]) => completed)
      .map(([task, _]) => task as keyof typeof this.feedback.times);

    for (const task of completedTasks) {
      const timeData = this.feedback.times[task];
      if (timeData.material === null || timeData.spade === null) {
        return false;
      }
    }

    return true;
  }

  // Call this method when user navigates away to save data
  ngOnDestroy(): void {
    this.saveFeedbackToLocalStorage();
  }
}
