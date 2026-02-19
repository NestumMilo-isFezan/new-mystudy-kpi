<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260219093000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add target_set_by enum-like column to kpi_aim';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE kpi_aim ADD target_set_by SMALLINT DEFAULT 0 NOT NULL');
        $this->addSql('UPDATE kpi_aim SET target_set_by = 1 WHERE lecturer_id IS NOT NULL');
        $this->addSql('UPDATE kpi_aim SET target_set_by = 2 WHERE batch_id IS NOT NULL AND student_id IS NULL');
        $this->addSql('ALTER TABLE kpi_aim ALTER COLUMN target_set_by DROP DEFAULT');
        $this->addSql('ALTER TABLE kpi_aim ADD CONSTRAINT chk_kpi_aim_target_set_by CHECK (target_set_by IN (0, 1, 2))');
        $this->addSql('CREATE INDEX idx_kpi_aim_student_target_set_by ON kpi_aim (student_id, target_set_by)');
        $this->addSql('CREATE INDEX idx_kpi_aim_batch_target_set_by ON kpi_aim (batch_id, target_set_by)');
        $this->addSql('CREATE INDEX idx_kpi_aim_lecturer_target_set_by ON kpi_aim (lecturer_id, target_set_by)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_kpi_aim_student_target_set_by');
        $this->addSql('DROP INDEX idx_kpi_aim_batch_target_set_by');
        $this->addSql('DROP INDEX idx_kpi_aim_lecturer_target_set_by');
        $this->addSql('ALTER TABLE kpi_aim DROP CONSTRAINT chk_kpi_aim_target_set_by');
        $this->addSql('ALTER TABLE kpi_aim DROP target_set_by');
    }
}
