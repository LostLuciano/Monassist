# MoneyAssist Backend Structure

## Complete File Structure

```
moneyassist-backend/
├── app/
│   ├── Console/
│   │   └── Kernel.php
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── GoalController.php
│   │   │   ├── ChatController.php
│   │   │   ├── RecommendationController.php
│   │   │   └── UserController.php
│   │   ├── Middleware/
│   │   │   ├── Authenticate.php
│   │   │   └── Cors.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   └── RegisterRequest.php
│   │   │   ├── Transaction/
│   │   │   │   ├── StoreTransactionRequest.php
│   │   │   │   └── UpdateTransactionRequest.php
│   │   │   └── Goal/
│   │   │       ├── StoreGoalRequest.php
│   │   │       └── UpdateGoalRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── TransactionResource.php
│   │       ├── GoalResource.php
│   │       └── RecommendationResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Transaction.php
│   │   ├── Category.php
│   │   ├── SavingsGoal.php
│   │   ├── ChatMessage.php
│   │   ├── Recommendation.php
│   │   └── Reminder.php
│   ├── Services/
│   │   ├── GeminiService.php
│   │   ├── FinancialAnalysisService.php
│   │   ├── RecommendationService.php
│   │   ├── ChatService.php
│   │   └── ReceiptProcessingService.php
│   └── Traits/
│       └── ApiResponse.php
├── bootstrap/
│   ├── app.php
│   └── cache/
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cors.php
│   ├── database.php
│   ├── filesystems.php
│   ├── gemini.php
│   └── sanctum.php
├── database/
│   ├── factories/
│   │   ├── UserFactory.php
│   │   ├── TransactionFactory.php
│   │   └── GoalFactory.php
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_01_000001_create_categories_table.php
│   │   ├── 2024_01_01_000002_create_transactions_table.php
│   │   ├── 2024_01_01_000003_create_savings_goals_table.php
│   │   ├── 2024_01_01_000004_create_chat_messages_table.php
│   │   ├── 2024_01_01_000005_create_recommendations_table.php
│   │   └── 2024_01_01_000006_create_reminders_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── CategorySeeder.php
│       └── UserSeeder.php
├── public/
│   ├── index.php
│   └── uploads/
│       ├── receipts/
│       └── avatars/
├── resources/
│   └── views/
│       └── emails/
├── routes/
│   ├── api.php
│   ├── web.php
│   └── channels.php
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/
├── tests/
│   ├── Feature/
│   │   ├── AuthTest.php
│   │   ├── TransactionTest.php
│   │   └── GoalTest.php
│   └── Unit/
│       ├── FinancialAnalysisTest.php
│       └── RecommendationTest.php
├── .env
├── .env.example
├── .gitignore
├── artisan
├── composer.json
├── composer.lock
├── phpunit.xml
└── README.md
```

## Key Components

### 1. Controllers

#### AuthController
- `register()` - Register new user
- `login()` - Authenticate user
- `logout()` - Logout user
- `me()` - Get current user
- `updateProfile()` - Update user profile
- `changePassword()` - Change password

#### TransactionController
- `index()` - List all transactions with filters
- `store()` - Create new transaction
- `show()` - Get single transaction
- `update()` - Update transaction
- `destroy()` - Delete transaction
- `uploadReceipt()` - Upload receipt image
- `statistics()` - Get transaction statistics
- `categoryBreakdown()` - Get expense by category
- `trends()` - Get spending trends
- `export()` - Export transactions

#### GoalController
- `index()` - List all goals
- `store()` - Create new goal
- `show()` - Get single goal
- `update()` - Update goal
- `destroy()` - Delete goal
- `updateProgress()` - Update goal progress
- `statistics()` - Get goals statistics

#### ChatController
- `sendMessage()` - Send chat message to AI
- `getHistory()` - Get chat history
- `processVoice()` - Process voice note
- `processReceipt()` - Process receipt image with OCR
- `getSuggestions()` - Get AI suggestions

#### RecommendationController
- `index()` - Get all recommendations
- `refresh()` - Generate new recommendations
- `dismiss()` - Dismiss recommendation
- `getSpendingInsights()` - Get spending insights
- `getSavingsOpportunities()` - Get savings opportunities

### 2. Models

#### User
```php
- id
- name
- email
- password
- phone
- currency
- language
- email_verified_at
- remember_token
- timestamps
```

#### Transaction
```php
- id
- user_id
- type (income/expense)
- amount
- category_id
- description
- date
- receipt_url
- payment_method
- timestamps
```

#### Category
```php
- id
- name
- type (income/expense)
- icon
- color
- timestamps
```

#### SavingsGoal
```php
- id
- user_id
- name
- target_amount
- current_amount
- deadline
- category
- description
- status
- timestamps
```

#### ChatMessage
```php
- id
- user_id
- message
- response
- context
- timestamps
```

#### Recommendation
```php
- id
- user_id
- type (warning/suggestion/achievement)
- category
- title
- description
- impact (high/medium/low)
- actionable
- dismissed_at
- timestamps
```

### 3. Services

#### GeminiService
- `generateText()` - Generate text using Gemini
- `analyzeImage()` - Analyze image (receipt OCR)
- `chat()` - Chat with AI
- `generateRecommendations()` - Generate financial recommendations

#### FinancialAnalysisService
- `analyzeFinancialStatus()` - Analyze user's financial health
- `calculateSavingsRate()` - Calculate savings rate
- `detectSpendingPatterns()` - Detect spending patterns
- `predictFutureExpenses()` - Predict future expenses
- `generateInsights()` - Generate financial insights

#### RecommendationService
- `generateRecommendations()` - Generate personalized recommendations
- `analyzeSpendingHabits()` - Analyze spending habits
- `suggestBudgetAdjustments()` - Suggest budget adjustments
- `identifyWasteAreas()` - Identify wasteful spending
- `suggestSavingsGoals()` - Suggest savings goals

#### ChatService
- `processMessage()` - Process chat message
- `getContextualResponse()` - Get contextual AI response
- `saveHistory()` - Save chat history
- `generateSuggestions()` - Generate quick suggestions

#### ReceiptProcessingService
- `processReceipt()` - Process receipt image
- `extractData()` - Extract transaction data from receipt
- `validateData()` - Validate extracted data
- `createTransaction()` - Create transaction from receipt

### 4. Middleware

#### Authenticate
- Verify JWT token
- Load authenticated user
- Handle unauthenticated requests

#### Cors
- Handle CORS headers
- Allow frontend origin
- Handle preflight requests

### 5. API Resources

Transform model data into JSON responses with proper structure and formatting.

### 6. Form Requests

Validate incoming requests with custom rules and messages.

### 7. Migrations

Database schema definitions for all tables with proper relationships and indexes.

### 8. Seeders

Populate database with initial data:
- Default categories
- Sample users (for testing)
- Sample transactions (for testing)

### 9. Tests

#### Feature Tests
- Test API endpoints
- Test authentication flow
- Test CRUD operations
- Test file uploads

#### Unit Tests
- Test services
- Test calculations
- Test data transformations

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error details"]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 15,
    "total": 150
  },
  "links": {
    "first": "url",
    "last": "url",
    "prev": null,
    "next": "url"
  }
}
```

## Authentication Flow

1. User registers/logs in
2. Server generates Sanctum token
3. Token returned to client
4. Client includes token in Authorization header
5. Server validates token on each request
6. User data available via `auth()->user()`

## File Upload Handling

1. Validate file type and size
2. Generate unique filename
3. Store in appropriate directory
4. Save file path in database
5. Return file URL in response

## Error Handling

- Validation errors: 422
- Authentication errors: 401
- Authorization errors: 403
- Not found errors: 404
- Server errors: 500

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CSRF protection
- SQL injection prevention
- XSS protection
- Rate limiting
- Input validation
- File upload validation

## Performance Optimization

- Database indexing
- Query optimization
- Eager loading relationships
- Response caching
- Image optimization
- API rate limiting

## Logging

- Request/response logging
- Error logging
- AI API call logging
- Performance monitoring

## Queue Jobs

- Email notifications
- Receipt processing
- Recommendation generation
- Report generation

## Scheduled Tasks

- Daily reminders
- Weekly reports
- Monthly summaries
- Goal deadline checks

## Next Steps

1. Install Laravel and dependencies
2. Create all migrations
3. Create all models with relationships
4. Create all controllers
5. Create all services
6. Set up routes
7. Configure CORS
8. Set up Sanctum
9. Create seeders
10. Write tests
11. Deploy to production

For detailed implementation, see the individual files in the backend directory.
