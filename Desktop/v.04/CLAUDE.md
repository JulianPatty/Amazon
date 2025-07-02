# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev      # Start development server with Vite
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Code Quality
```bash
npm run lint     # Run Biome linter
npm run lint:fix # Auto-fix linting issues
npm run format   # Format code with Biome
```

## Architecture Overview

This is a **Workflow Builder Application** that provides a visual interface for creating and managing workflows with drag-and-drop functionality.

### Core Technologies
- **React 19.1.0** with TypeScript for the frontend
- **Vite** as the build tool
- **ReactFlow** for workflow visualization
- **Tailwind CSS** for styling
- **Radix UI** for accessible UI primitives
- **Biome** for linting and formatting (not ESLint despite config presence)

### Key Architectural Decisions

1. **Component-Based Architecture**: The application uses a modular component structure with clear separation between:
   - `/src/components/dialogs/` - Modal dialogs for various features
   - `/src/components/nodes/` - Individual workflow node components
   - `/src/components/ui/` - Reusable UI components built on Radix UI

2. **Workflow System**: The application supports 21 different block types (START, AGENT, API, GMAIL, etc.) that can be connected to create workflows. Each block type has:
   - A corresponding node component in `/src/components/nodes/`
   - Type definitions in `/src/types/workflow.ts`
   - Visual representation handled by ReactFlow

3. **State Management**: Uses React hooks for state management without global state libraries:
   - `useWorkflowState` - Manages workflow data
   - `useLogsState` - Handles logging functionality
   - Local component state for UI interactions

4. **Multiple AI Integrations**: The project integrates with various AI providers (Anthropic, OpenAI, Groq, Cerebras) and includes corresponding SDKs.

### Important Development Notes

- **No test infrastructure** is currently set up
- **Environment variables** are required (check `.env.example` if available)
- **TypeScript strict mode** is enabled - maintain type safety
- When adding new workflow blocks:
  1. Add the block type to the `BlockType` enum in `/src/types/workflow.ts`
  2. Create the node component in `/src/components/nodes/`
  3. Update the `nodeTypes` mapping in `WorkflowCanvas.tsx`
- Follow existing component patterns and file organization
- Use Biome for all formatting and linting tasks