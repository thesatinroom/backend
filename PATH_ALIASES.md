# Path Aliases Configuration

This project is configured with TypeScript path aliases to make imports cleaner and more maintainable.

## Available Aliases

| Alias | Path | Description |
|-------|------|-------------|
| `@/*` | `src/*` | General source files |
| `@app/*` | `src/app/*` | Main application files |
| `@config/*` | `src/config/*` | Configuration files |
| `@common/*` | `src/common/*` | Common utilities and shared code |
| `@modules/*` | `src/modules/*` | Feature modules |
| `@entities/*` | `src/entities/*` | Database entities |
| `@dto/*` | `src/dto/*` | Data Transfer Objects |
| `@interfaces/*` | `src/interfaces/*` | TypeScript interfaces |
| `@guards/*` | `src/guards/*` | Authentication guards |
| `@decorators/*` | `src/decorators/*` | Custom decorators |
| `@pipes/*` | `src/pipes/*` | Validation pipes |
| `@filters/*` | `src/filters/*` | Exception filters |
| `@middleware/*` | `src/middleware/*` | Custom middleware |
| `@utils/*` | `src/utils/*` | Utility functions |
| `@constants/*` | `src/constants/*` | Application constants |
| `@types/*` | `src/types/*` | Custom type definitions |

## Usage Examples

### Before (Relative Imports)
```typescript
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { getDatabaseConfig } from '../../config/database.config';
```

### After (Path Aliases)
```typescript
import { User } from '@entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import { getDatabaseConfig } from '@config/database.config';
```

## Configuration Files

The path aliases are configured in:

1. **`tsconfig.json`** - TypeScript compiler configuration
2. **`nest-cli.json`** - NestJS CLI configuration
3. **`webpack.config.js`** - Webpack build configuration
4. **`tsconfig-paths-bootstrap.js`** - Runtime path resolution

## Development vs Production

- **Development**: Path aliases work automatically with `ts-node` and `tsconfig-paths`
- **Production**: Path aliases are resolved by webpack during build

## Adding New Aliases

To add new path aliases:

1. Update `tsconfig.json` with new paths
2. Update `webpack.config.js` with corresponding aliases
3. Restart your development server

## Troubleshooting

If path aliases don't work:

1. Make sure you've restarted your development server
2. Check that the alias is defined in both `tsconfig.json` and `webpack.config.js`
3. Verify the path exists in your project structure
4. Clear your `dist` folder and rebuild

## Benefits

- **Cleaner imports**: No more `../../../` relative paths
- **Better maintainability**: Easy to move files without breaking imports
- **IDE support**: Better autocomplete and navigation
- **Consistent structure**: Standardized import patterns across the project
