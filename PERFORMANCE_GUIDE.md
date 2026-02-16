# Performance Prevention Guide

## React/Next.js Best Practices

### 1. Hook Dependency Arrays

**❌ BAD - Causes Infinite Loops:**
```typescript
const handleValidate = () => { /* logic */ };

useEffect(() => {
  handleValidate();
}, [formData, handleValidate]); // handleValidate recreated every render!
```

**✅ GOOD:**
```typescript
// Option A: Remove from deps if stable
useEffect(() => {
  onValidate(isValid);
}, [formData]); // Only re-run when data changes

// Option B: Wrap in useCallback
const handleValidate = useCallback(() => {
  /* logic */
}, []);

useEffect(() => {
  handleValidate();
}, [formData, handleValidate]); // Now handleValidate is stable
```

### 2. Memoize Expensive Computations

**❌ BAD - Recalculates Every Render:**
```typescript
function Dashboard() {
  const filtered = results.filter(r => r.category === selected); // Runs every render!
  const total = filtered.reduce((sum, r) => sum + r.value, 0);

  return <div>{total}</div>;
}
```

**✅ GOOD:**
```typescript
function Dashboard() {
  const filtered = useMemo(
    () => results.filter(r => r.category === selected),
    [results, selected] // Only recalculate when these change
  );

  const total = useMemo(
    () => filtered.reduce((sum, r) => sum + r.value, 0),
    [filtered]
  );

  return <div>{total}</div>;
}
```

### 3. Extract Constants Outside Components

**❌ BAD - Recreated Every Render:**
```typescript
function MySelect() {
  const OPTIONS = [
    { value: 'AL', label: 'Alabama' },
    // ... 50 more states
  ];

  return <Select options={OPTIONS} />;
}
```

**✅ GOOD:**
```typescript
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  // ... 50 more states
]; // Outside component - created once

function MySelect() {
  return <Select options={US_STATES} />;
}
```

### 4. Stable Object/Array References

**❌ BAD - New Object Every Render:**
```typescript
<ChildComponent config={{ theme: 'dark', size: 'large' }} />
// ChildComponent re-renders even if theme/size don't change!
```

**✅ GOOD:**
```typescript
const config = useMemo(() => ({ theme: 'dark', size: 'large' }), []);
<ChildComponent config={config} />

// OR extract to constant if truly static:
const CONFIG = { theme: 'dark', size: 'large' };
<ChildComponent config={CONFIG} />
```

## Monitoring & Debugging

### Check for Performance Issues

```bash
# Check CPU usage of Next.js dev server
ps aux | grep next-server | grep -v grep

# Should see 0.0-2.0% CPU during idle
# If seeing >10% CPU, you have a re-render loop
```

### Use React DevTools Profiler

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click "Record"
4. Interact with your app
5. Stop recording
6. Look for:
   - Components rendering >10 times
   - Render times >100ms
   - Unnecessary re-renders (no props changed)

### Enable React Strict Mode

Already enabled in `app/layout.tsx` for development - it helps catch issues early by:
- Detecting unsafe lifecycle methods
- Warning about deprecated APIs
- Double-invoking functions to surface side effects

## Common Pitfalls

### 1. Inline Function Props

**❌ BAD:**
```typescript
<Button onClick={() => handleClick(id)} />
// New function created every render!
```

**✅ GOOD:**
```typescript
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<Button onClick={handleButtonClick} />
```

### 2. Large State Objects

**❌ BAD:**
```typescript
const [state, setState] = useState({
  user: {...},
  settings: {...},
  cache: {...},
  results: [...]
}); // Updating one field re-renders entire object
```

**✅ GOOD:**
```typescript
const [user, setUser] = useState({...});
const [settings, setSettings] = useState({...});
const [cache, setCache] = useState({...});
const [results, setResults] = useState([...]);
// Each can update independently
```

### 3. Context Overuse

**❌ BAD:**
```typescript
// Putting everything in one context
<AppContext.Provider value={{ user, settings, theme, data, filters }}>
  // Any change to value causes ALL consumers to re-render!
</AppContext.Provider>
```

**✅ GOOD:**
```typescript
// Split into focused contexts
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <DataContext.Provider value={data}>
      // Only relevant consumers re-render
    </DataContext.Provider>
  </ThemeContext.Provider>
</UserContext.Provider>
```

## Performance Checklist

Before deploying new features:

- [ ] No `any` types in hook dependencies
- [ ] Functions passed to useEffect wrapped in useCallback (if needed)
- [ ] Expensive calculations wrapped in useMemo
- [ ] Large static data extracted outside components
- [ ] Context providers only pass necessary data
- [ ] No inline object/array literals in JSX props
- [ ] React DevTools shows no excessive re-renders
- [ ] CPU usage stays <5% during typical user interactions

## Development Environment

### Restart Dev Server Cleanly

If you notice high CPU usage:

```bash
# Kill all Next.js processes
pkill -f "next-server"

# Wait 2 seconds
sleep 2

# Restart fresh
npm run dev
```

### Monitor During Development

Add to `package.json` scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "check-perf": "ps aux | grep next-server | grep -v grep"
  }
}
```

Run `npm run check-perf` periodically to catch issues early.

## Resources

- [React Hooks Rules](https://react.dev/reference/react/hooks#rules-of-hooks)
- [useMemo Documentation](https://react.dev/reference/react/useMemo)
- [useCallback Documentation](https://react.dev/reference/react/useCallback)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**Last Updated:** 2026-01-17
**Related:** See refactoring plan in `/.claude/plans/bright-snuggling-wigderson.md`


#assessment #financial-inclusion
