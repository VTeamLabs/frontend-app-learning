import { Factory } from 'rosie'; // eslint-disable-line import/no-extraneous-dependencies

// Sample data helpful when developing & testing, to see a variety of configurations.
// This set of data may not be realistic, but it is intended to demonstrate many UI results.
Factory.define('progressTabData')
  .attrs({
    end: '3027-03-31T00:00:00Z',
    certificate_data: {},
    completion_summary: {
      complete_count: 1,
      incomplete_count: 1,
      locked_count: 0,
    },
    course_grade: {
      letter_grade: 'pass',
      percent: 1,
      is_passing: true,
    },
    section_scores: [
      {
        display_name: 'First section',
        subsections: [
          {
            assignment_type: 'Homework',
            display_name: 'First subsection',
            has_graded_assignment: true,
            num_points_earned: 0,
            num_points_possible: 1,
            percent_graded: 0.0,
            show_correctness: 'always',
            show_grades: true,
            url: 'http://learning.edx.org/course/course-v1:edX+Test+run/first_subsection',
          },
        ],
      },
      {
        display_name: 'Second section',
        subsections: [
          {
            assignment_type: 'Homework',
            display_name: 'Second subsection',
            has_graded_assignment: true,
            num_points_earned: 1,
            num_points_possible: 1,
            percent_graded: 1.0,
            show_correctness: 'always',
            show_grades: true,
            url: 'http://learning.edx.org/course/course-v1:edX+Test+run/second_subsection',
          },
        ],
      },
    ],
    enrollment_mode: 'audit',
    grading_policy: {
      assignment_policies: [
        {
          num_droppable: 1,
          num_total: 2,
          short_label: 'HW',
          type: 'Homework',
          weight: 1,
        },
      ],
      grade_range: {
        pass: 0.75,
      },
    },
    has_scheduled_content: false,
    studio_url: 'http://studio.edx.org/settings/grading/course-v1:edX+Test+run',
    user_has_passing_grade: false,
    verification_data: {
      link: null,
      status: 'none',
      status_date: null,
    },
    verified_mode: null,
  });
