# JiwonBot 🎮

> A Discord bot that quickly and fairly assigns balanced teams for in-house matches with friends

JiwonBot is a Discord bot designed to create fair and balanced teams for gaming sessions. Using advanced algorithms based on player tiers, it provides optimal team compositions for competitive matches.

## ✨ Key Features

### 🎯 Smart Team Balancing
- **Advanced Algorithms**: Uses multiple optimization algorithms (Brute Force, Greedy, Genetic Algorithm, Local Search) for precise team balancing
- **Multi-Game Support**: Supports Valorant and League of Legends tier systems
- **Voice Channel Integration**: Automatically detects players in voice channels for team composition
- **Balance Quality Rating**: Provides balance grades from Perfect to Poor with detailed quality scores

### 🎮 Mini Games
- **Coin Flip**: Simple probability-based game
- **Rock Paper Scissors**: Interactive game for two players
- **Random Map Selection**: Randomly selects maps for Valorant, PUBG, CS2, and more

### 🌐 Multi-Language Support
- **Korean/English Support**: Server-specific language settings
- **Auto Localization**: All messages and UI elements are displayed in the selected language

### 📊 Tier Management
- **Personal Tier Registration**: Store individual tier information per game
- **Tier Lookup**: Check your own or other users' tier information
- **Automatic Balancing**: Accurate team balancing based on registered tiers

## 🧮 Team Balancing Algorithm

JiwonBot uses sophisticated algorithms to find optimal team balance:

### Algorithm Types
1. **Brute Force**: Examines all possible combinations for optimal solutions
2. **Greedy Search**: Provides fast approximate solutions with greedy approach
3. **Genetic Algorithm**: Global optimization through evolutionary algorithms
4. **Multi-Start Local Search**: Local search with multiple starting points

### Evaluation Factors
- **Score Balance**: Minimizes total score difference between teams
- **Skill Variance**: Ensures even skill distribution within teams
- **Role Balance**: Distributes carry/support/balanced roles appropriately
- **Team Synergy**: Considers player cooperation potential

### Quality Grades
- **🏆 Perfect (95-100)**: Nearly perfect balance
- **⭐ Excellent (85-94)**: Very good balance  
- **👍 Good (70-84)**: Acceptable balance
- **👌 Acceptable (50-69)**: Usable level
- **😞 Poor (0-49)**: Needs improvement

## 🎨 Fragment System

All Discord Embeds and UI components are managed using the Fragment pattern:

```typescript
// Example: Team Balance Result Fragment
export class EmbedBalanceTeam extends BaseFragment {
  async balanceResult(solution: BalanceSolution): Promise<EmbedBuilder> {
    await this.ensureInitialized();
    // Embed creation logic
  }
}
```

### Fragment Features
- **Multi-language Support**: Automatic language detection and translation
- **Reusability**: Modular UI components
- **Consistency**: Unified design system

## 🔧 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Discord API**: discord.js v14
- **Database**: PostgreSQL + Prisma ORM
- **Architecture**: Modular command system
- **Team Balancing**: Custom optimization algorithms

## 🏗️ Project Structure

```
src/
├── commands/           # Slash commands
│   ├── game/          # Game-related commands
│   ├── minigame/      # Mini-game commands
│   └── setting/       # Settings commands
├── core/              # Core systems
│   ├── bot.ts         # Discord client setup
│   ├── team-balancer.ts # Team balancing algorithms
│   ├── commandHandler.ts # Command handler
│   └── eventHandler.ts   # Event handler
├── fragments/         # UI components (Embed generation)
│   ├── base/          # Base Fragment class
│   ├── game/          # Game-related Embeds
│   ├── minigame/      # Mini-game Embeds
│   └── error/         # Error Embeds
├── database/          # Database logic
├── constants/         # Constant definitions
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

**iamfiro** - [@iamfiro](https://github.com/iamfiro)

---

⭐ If you find this project useful, please give it a star!