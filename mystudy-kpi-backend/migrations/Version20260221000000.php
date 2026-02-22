<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Widen SMALLINT identity PKs to BIGINT on mentorship, mentee, and semester_record.
 *
 * Rationale: SMALLINT caps at 32 767 rows. These tables grow with every cohort
 * assignment and semester registration, so an early migration is safer than an
 * emergency rename later.
 */
final class Version20260221000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Widen mentorship, mentee, and semester_record primary-key columns from SMALLINT to BIGINT';
    }

    public function up(Schema $schema): void
    {
        // --- mentee.mentorship_id FK must be dropped before altering mentorship.id ---
        $this->addSql('ALTER TABLE mentee DROP CONSTRAINT FK_F9290F9339CF49FD');

        // Widen mentorship PK (identity sequence is preserved; only the storage type changes)
        $this->addSql('ALTER TABLE mentorship ALTER COLUMN id TYPE BIGINT');

        // Widen the matching FK column on mentee
        $this->addSql('ALTER TABLE mentee ALTER COLUMN id TYPE BIGINT');
        $this->addSql('ALTER TABLE mentee ALTER COLUMN mentorship_id TYPE BIGINT');

        // Widen semester_record PK
        $this->addSql('ALTER TABLE semester_record ALTER COLUMN id TYPE BIGINT');

        // Restore the FK
        $this->addSql('ALTER TABLE mentee ADD CONSTRAINT FK_F9290F9339CF49FD FOREIGN KEY (mentorship_id) REFERENCES mentorship (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE mentee DROP CONSTRAINT FK_F9290F9339CF49FD');

        $this->addSql('ALTER TABLE mentorship ALTER COLUMN id TYPE SMALLINT');
        $this->addSql('ALTER TABLE mentee ALTER COLUMN id TYPE SMALLINT');
        $this->addSql('ALTER TABLE mentee ALTER COLUMN mentorship_id TYPE SMALLINT');
        $this->addSql('ALTER TABLE semester_record ALTER COLUMN id TYPE SMALLINT');

        $this->addSql('ALTER TABLE mentee ADD CONSTRAINT FK_F9290F9339CF49FD FOREIGN KEY (mentorship_id) REFERENCES mentorship (id) ON DELETE CASCADE NOT DEFERRABLE');
    }
}
