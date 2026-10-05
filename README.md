# Grainathon 4.0 Leaderboard: Retro TV Website (DJSNSS)

A single-page React + Vite web application built for **DJSNSS** displaying the live leaderboard for **Grainathon 4.0** inside a handcrafted, realistic-cartoon vintage CRT television.

---

## 🚀 Features

- **Handcrafted CRT TV Artwork**: Wooden walnut cabinet with SVG wood grain texture, dark front bezel with brass trim line, double stubby feet, and metallic screws.
- **Realistic CRT Glass & Glow**: Superellipse curved CRT glass screen with scanlines, radial phosphor glow, corner vignettes, glass glare reflections, subtle CRT flicker, and slow horizontal roll bar.
- **Interactive Channel Knob**: Working Bakelite knob with 24 serrated knurled teeth, brass collar, pointer notch, and smooth spring-animated rotation.
- **Channel Switching Transitions**: Includes static noise burst (`feTurbulence`), horizontal tear glitch effect, and on-screen display (OSD) channel indicator (`CH 01`, `CH 02`, `CH 03`).
- **Bespoke Score Plates**: Chamfered neon-mint score plates for Top 3 with double outlines, rank tokens, gold/silver/bronze accents, crown badge, and count-up number animations.
- **Keyboard Navigation**: Press `ArrowRight` / `ArrowLeft` or `Space` / `Enter` on the knob to cycle channels.

---

## 🛣️ Routes and Data Flow

### Frontend Routes
- `/` (`PageStatic.jsx`): Displays `CH1` (Top 3 Departments static podium view). Knobs and auto-rotation are disabled.
- `/live` (`PageRotating.jsx`): Displays live rotating views cycling automatically between `CH2` (All Department Rankings) and `CH3` (Committee Rankings) every 8 seconds, with interactive channel knob, tuning wheel, auto-scrolling, and keyboard navigation.
- `*`: Fallback route redirecting all unknown URL paths to `/`.

### Data Flow & Backend Integration Status
- **Current State**: Uses static mock data defined in `src/data/leaderboardData.js` (`topDepartments`, `topCommittees`, `topDonors`).
- **Automatic Updates**: Currently **not automatic**. The `useLeaderboard` custom hook reads from local mock state synchronously.
- **To Connect a Real Backend**:
  1. Replace static import in `src/hooks/useLeaderboard.js` with an async `fetch()` or `axios` call (e.g. `import.meta.env.VITE_API_URL + '/api/leaderboard'`).
  2. Implement polling (`setInterval`) or WebSocket / SSE listeners to refetch records when new donations are entered.
  3. Ensure the API JSON response matches expected array shapes:
     - Departments: `[{ id: number, code: string, name: string, score: number }]`
     - Committees: `[{ id: number, name: string, score: number }]`

---

## 🛠️ Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📖 Customization & Configuration

### 1. Replacing the Background Collage
Place your TV-show collage image file at `src/assets/bg/collage.jpg`. 
If no image is provided, the `<Stage>` component seamlessly falls back to a stylish retro charcoal dark grid with a teal radial highlight.

### 2. Updating Leaderboard Data
Edit `src/data/leaderboardData.js`. You can modify scores, names, or ids for each channel:

```javascript
export const leaderboardData = {
  topDepartments: [
    { id: 1, name: 'AI & Data Science (AIHL)', score: 1250 },
    // ...
  ],
  topCommittees: [ ... ],
  topDonors: [ ... ]
};
```

### 3. Adding a New Channel
To add a 4th channel or modify channel configurations, edit the `CHANNELS` array in `src/data/leaderboardData.js`:

```javascript
export const CHANNELS = [
  {
    id: 3,
    knobAngle: 180,
    tapeLabel: 'TOP VOLUNTEERS',
    leftHeader: 'VOLUNTEER',
    rightHeader: 'HOURS',
    dataKey: 'topVolunteers',
    chCode: 'CH 04'
  }
];
```

---

## 🎨 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: CSS Modules + Design Tokens (`tokens.css`, `globals.css`)
- **Animation**: Framer Motion
- **Fonts**: Google Fonts (`Gochi Hand`, `Special Elite`, `Chakra Petch`, `Share Tech Mono`)
- **Graphics**: SVG inline filters (`feTurbulence`, `feColorMatrix`, radial gradients)

Developed with ❤️ for **DJSNSS**.
