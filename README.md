# Cross-Platform System Interaction 🖥️  
*(cross-platform-system-interaction)*  

[![NPM Version](https://img.shields.io/npm/v/cross-platform-system-interaction.svg)](https://www.npmjs.com/package/cross-platform-system-interaction)  
[![NPM Downloads](https://img.shields.io/npm/dt/cross-platform-system-interaction.svg)](https://www.npmjs.com/package/cross-platform-system-interaction)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)  

A unified and simplified API to interact with native operating system functionalities (Windows, macOS, and Linux) in Node.js environments.  

---

## 🚀 Why use this package?  
Many Node.js projects — especially CLI tools, automation utilities, and desktop applications (via Electron) — need to interact deeply with the operating system.  

The native Node.js API (`fs`, `child_process`, `os`) is functional but often requires complex conditional logic, such as:  

```js
if (process.platform === 'win32') {
  // Windows-specific logic
}
```

**cross-platform-system-interaction** abstracts away these differences, providing a consistent interface and advanced features that let you build cross-platform applications more efficiently with less code.  

---

## ✨ Features  

- **Advanced File Management**  
  Copy, move, delete, change permissions, get metadata, and watch files/directories in real time. Includes helpers for JSON manipulation.  

- **Robust Process Control**  
  Start, monitor, interact with `stdin`, terminate, and find processes by name or PID.  

- **System Information Access**  
  Get details about CPU, memory usage, network interfaces, platform, hostname, and more.  

- **Clipboard Management**  
  Programmatically copy and paste text with a simple cross-platform API.  

- **Typed Error Handling**  
  Custom error classes (`FileError`, `ProcessError`) with detailed context for debugging.  

---

## 📦 Installation  

```bash
npm install cross-platform-system-interaction
```

---

## 🔧 Usage  

The library is organized into namespaces: **file**, **process**, **system**, and **clipboard**.  

```js
import { file, process, system, clipboard } from 'cross-platform-system-interaction';
```

---

### 📄 1. `file` Module (File Management)  

**Read and Write JSON**  
```js
async function manageConfig() {
  const configPath = './config.json';
  const defaultConfig = { version: 1, theme: 'dark' };

  await file.writeJson(configPath, defaultConfig, { space: 2 });
  console.log('Config file created.');

  const config = await file.readJson(configPath);
  console.log('Current theme:', config.theme);
}
```

**Copy and Remove Files/Directories**  
```js
async function organizeFiles() {
  const sourceDir = './temp/logs';
  const backupDir = './backup/logs';

  await file.copy(sourceDir, backupDir, { recursive: true });
  console.log(`Logs copied to ${backupDir}`);

  await file.remove(sourceDir, { recursive: true });
  console.log('Temporary logs directory removed.');
}
```

**Watch for Changes**  
```js
const watcher = file.watch('./src');
watcher.on('change', path => console.log(`File changed: ${path}`));
```

---

### ⚙️ 2. `process` Module (Process Management)  

**Execute a Command with Error Handling**  
```js
import { process as proc, ProcessError } from 'cross-platform-system-interaction';

async function getCurrentBranch() {
  try {
    const { stdout } = await proc.execute('git', ['branch', '--show-current']).finished;
    console.log('Current branch:', stdout.trim());
  } catch (error) {
    if (error instanceof ProcessError) {
      console.error(`Git command failed (Exit Code: ${error.exitCode}):`, error.stderr);
    }
  }
}
```

**Find and Kill a Process**  
```js
async function manageServer() {
  const nodeProcesses = await proc.findProcessByName('node');
  console.log(`Found ${nodeProcesses.length} 'node' processes.`);

  if (nodeProcesses.length > 0) {
    const pid = nodeProcesses[0];
    await proc.kill(pid);
    console.log('Process terminated.');
  }
}
```

---

### 💻 3. `system` Module (System Information)  

```js
function logSystemInfo() {
  console.log(`Platform: ${system.getPlatform()} (${system.getArch()})`);

  const mem = system.getMemoryUsage();
  console.log(`Memory: ${(mem.usedPercent * 100).toFixed(2)}% of ${(mem.total / 1e9).toFixed(2)} GB`);

  const cpus = system.getCpuInfo();
  console.log(`CPU: ${cpus.length} cores | Model: ${cpus[0].model}`);
}
```

---

### 📋 4. `clipboard` Module (Clipboard Management)  

```js
async function manipulateClipboard() {
  await clipboard.write(`Text copied at: ${new Date().toLocaleTimeString()}`);
  const content = await clipboard.read();
  console.log('Clipboard content:', content);
}
```

---

## 🛑 Error Handling  

- **SystemInteractionError**: base error for all others.  
- **FileError**: includes `filePath`.  
- **ProcessError**: includes `command`, `exitCode`, and `stderr`.  

```js
import { file, FileError } from 'cross-platform-system-interaction';

try {
  await file.readJson('/invalid.json');
} catch (error) {
  if (error instanceof FileError) {
    console.error(`File error at: ${error.filePath}`);
  }
}
```

---

## 📖 Quick API Reference  

| Module    | Function               | Description                                |
|-----------|------------------------|--------------------------------------------|
| **file**  | exists(path)           | Checks if a file or directory exists.      |
|           | getMetadata(path)      | Retrieves file/directory metadata.         |
|           | setPermissions(path)   | Changes permissions (chmod).               |
|           | remove(path, opts)     | Removes a file or directory.               |
|           | copy(src, dest, opts)  | Copies a file or directory.                |
|           | readJson(path)         | Reads and parses a JSON file.              |
|           | writeJson(path, data)  | Writes an object to a JSON file.           |
|           | watch(path, opts)      | Watches for real-time changes.             |
| **process** | execute(cmd, args)   | Executes a process.                        |
|           | kill(pid, force)       | Kills a process by PID.                    |
|           | findProcessByName(name)| Finds processes by name.                   |
| **system** | getPlatform()         | Returns the OS platform (e.g., `win32`).   |
|           | getArch()              | Returns the CPU architecture (e.g., `x64`).|
|           | getMemoryUsage()       | Returns memory usage.                      |
|           | getCpuInfo()           | Returns CPU core info.                     |
|           | getNetworkInterfaces() | Returns network interfaces.                |
|           | getHostname()          | Returns the system hostname.               |
| **clipboard** | read()             | Reads clipboard text.                      |
|              | write(text)         | Writes text to clipboard.                  |

---

## 🤝 Contributing  

1. Fork the repository.  
2. Create a new branch (`git checkout -b feature/new-feature`).  
3. Implement your changes + tests.  
4. Open a **Pull Request**.  

---

## 📜 License  

This project is licensed under the [MIT License](LICENSE).  
