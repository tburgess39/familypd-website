# What was fixed

## Website navigation
The earlier edit changed only one page. Each website page contains its own navigation HTML, so the old/blank button returned when moving to another page. This package updates every included page and adds an isolated `family-pd-os-nav-button` rule to the shared stylesheet.

## Family Profile generator
The earlier generator passed the wrong object fields to the existing values and commitments editors and called the render functions without their required arrays. It could show a message while generating no visible values or commitments.

The corrected button now:
- generates mission, vision, motto, values, and commitments;
- uses the existing editors correctly;
- shows a visible preview;
- moves the user to the editable Mission & Vision section;
- supports a true blank custom profile with guidance.
