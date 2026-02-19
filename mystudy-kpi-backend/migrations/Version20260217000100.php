<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260217000100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add intake batch start year and uniqueness';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE intake_batch ADD start_year SMALLINT DEFAULT NULL');
        $this->addSql("UPDATE intake_batch SET start_year = CAST(substring(name FROM '^([0-9]{4})/[0-9]{4}$') AS SMALLINT) WHERE start_year IS NULL AND name ~ '^[0-9]{4}/[0-9]{4}$'");
        $this->addSql("UPDATE intake_batch SET start_year = CAST(CASE WHEN CAST(substring(name FROM '^([0-9]{2})/[0-9]{2}$') AS SMALLINT) <= 69 THEN 2000 + CAST(substring(name FROM '^([0-9]{2})/[0-9]{2}$') AS SMALLINT) ELSE 1900 + CAST(substring(name FROM '^([0-9]{2})/[0-9]{2}$') AS SMALLINT) END AS SMALLINT) WHERE start_year IS NULL AND name ~ '^[0-9]{2}/[0-9]{2}$'");
        $this->addSql("DO $$ BEGIN IF EXISTS (SELECT 1 FROM intake_batch WHERE start_year IS NULL) THEN RAISE EXCEPTION 'Unable to infer start_year for existing intake_batch records. Please set start_year manually.'; END IF; END $$");
        $this->addSql('ALTER TABLE intake_batch ALTER COLUMN start_year SET NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX uniq_intake_batch_start_year ON intake_batch (start_year)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX uniq_intake_batch_start_year');
        $this->addSql('ALTER TABLE intake_batch DROP start_year');
    }
}
