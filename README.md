# Boids Time Display

A creative web application that displays the current time with characters that move using the boids flocking algorithm.

## Features

- **Real-time Clock**: Displays the current time in the center of the screen
- **Boids Algorithm**: Each character of the time moves as a boid, following flocking behaviors:
  - **Separation**: Characters avoid getting too close to each other
  - **Alignment**: Characters tend to move in the same direction as nearby characters
  - **Cohesion**: Characters are drawn toward the center of nearby characters
- **Network Visualization**: Lines connect nearby characters, with thickness and opacity indicating interaction strength
- **Clean Design**: White background with black characters for a minimalist aesthetic
- **Responsive**: Adapts to different screen sizes

## File Structure

```
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript with boids algorithm
└── README.md       # This file
```

## How to Run

1. Open `index.html` in a web browser
2. The time will be displayed in the center
3. Each character of the time will move around the screen using the boids algorithm
4. The time updates every second, and new boids are created with the new time characters

## Boids Algorithm

The boids algorithm simulates flocking behavior with three main rules:

1. **Separation**: Each boid steers away from nearby boids to avoid crowding
2. **Alignment**: Each boid steers toward the average heading of nearby boids
3. **Cohesion**: Each boid steers toward the average position of nearby boids

This creates natural-looking flocking behavior where the time characters move together while maintaining appropriate spacing.

## Network Visualization

The application includes a network visualization that shows the connections between nearby characters:

- **Connection Lines**: Lines are drawn between characters that are within 80 pixels of each other
- **Line Thickness**: Thicker lines indicate stronger interactions (closer characters)
- **Line Opacity**: More opaque lines indicate closer characters
- **Dynamic Updates**: The network connections update in real-time as characters move

## Technologies Used

- HTML5 Canvas for rendering
- Vanilla JavaScript for the boids algorithm
- CSS for styling and layout 