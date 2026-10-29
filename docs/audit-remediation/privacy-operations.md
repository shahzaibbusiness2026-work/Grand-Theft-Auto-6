# Manual privacy operations

Policy adopted 28 October 2026 after the operator authorized selecting practical defaults. Operator: Taish Gaming, Pakistan. The published contact channel is `/contact?topic=privacy`; do not invent a postal address, mailbox or legal entity name.

The site does not run an automatic retention deletion job. These are manual operating targets, and no production accounts/messages were deleted during implementation.

| Record | Review/action | Responsible role |
| --- | --- | --- |
| Resolved contact messages | Review for deletion 90 days after closure; document any necessary exception | Operator/inbox reviewer |
| Newsletter subscription | Retain while subscribed; existing signed-unsubscribe action removes the matching active record with a compare-and-swap write | Application + operator for older links |
| Account | Review after 12 months of inactivity; retain active accounts; verified deletion can be requested at any time | Operator/account administrator |
| Access/deletion request | Target response and action within 30 days after identity/control verification; explain delays | Operator |
| Browser notes/favorites | User clears device storage; server deletion does not remove these | User |

Review the contact inbox at least weekly for privacy subjects. Record the request URL/category, received date, verification date, deadline target, action taken, completion date and any retained-record reason in a private operations record. Do not publish request details in Git, analytics, or the public settings table.

Verify control of the relevant email/account before disclosure or deletion. Do not request passwords, recovery codes or identity documents in the initial contact message. Do not delete records solely because an unauthenticated message names another person's email.

Before applying a deletion, inspect current records and dependent session/subscription data. Revoke applicable sessions when deleting an account; account deletion alone must not be treated as invalidating an existing token. Use the existing authorized administration workflow and record the result. Do not use an old JSON backup to overwrite subsequent user changes.

Provider delivery logs, hosting/security logs and backups require separate provider-setting reviews. Their retention/deletion has not been verified by this implementation. The public policy explicitly discloses that boundary. Run an end-to-end deletion exercise with an authorized disposable test identity before claiming an operational SLA or automated purge is verified.
