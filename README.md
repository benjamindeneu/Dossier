# Mr. White — Word Game

A pass-the-device party game of words and lies. Three roles, one truth — civilians share a secret word, undercovers hold a similar but different word, and Mr. White knows nothing at all.

## How to Play

1. **3+ players, one device.**
2. Set the number of players, undercovers, and whether Mr. White is in the mix.
3. Pass the device — each player privately taps to reveal their role and secret word.
4. Each round, every living player gives **one word** describing their secret.
5. Discuss, then vote out a suspect.
6. If Mr. White is voted out, they get one chance to guess the civilians' word and steal the win.
7. Civilians win when all impostors are caught. Impostors win when they equal the civilians in number.

## Host on GitHub Pages

1. Create a new repository on GitHub (e.g. `mrwhite`).
2. Upload these three files to the root of the repository:
   - `index.html`
   - `game.js`
   - `words.js`
3. Go to **Settings → Pages**.
4. Under "Build and deployment", set the source to **Deploy from a branch**.
5. Pick the `main` branch and `/ (root)` folder, then click **Save**.
6. Your game will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

That's it — no build step, no dependencies, fully static.

## Customization

- **Add more word pairs:** edit `words.js` and append to the `WORD_PAIRS` array. Each pair should be two conceptually-close words (Coffee/Tea, Lion/Tiger, etc.).
- **Tweak flavor text:** edit `ROLE_FLAVOR` in `words.js` to change the little italic hints shown on each role's card.
- **Change colors:** edit the CSS variables at the top of `index.html` (`--paper`, `--blood`, `--gold`, etc.).

## File Structure

```
.
├── index.html    # The full app + styles
├── game.js       # Game logic (state, navigation, voting)
└── words.js      # Word pair database + role flavor text
```

No frameworks, no build tools — just plain HTML, CSS, and JavaScript.
