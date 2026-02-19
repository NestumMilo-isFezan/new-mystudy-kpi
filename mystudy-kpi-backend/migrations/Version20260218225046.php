<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218225046 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cgpa_record ALTER gpa DROP NOT NULL');
        $this->addSql('DROP INDEX idx_kpi_aim_lecturer_target_set_by');
        $this->addSql('DROP INDEX idx_kpi_aim_batch_target_set_by');
        $this->addSql('DROP INDEX idx_kpi_aim_student_target_set_by');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cgpa_record ALTER gpa SET NOT NULL');
        $this->addSql('CREATE INDEX idx_kpi_aim_lecturer_target_set_by ON kpi_aim (lecturer_id, target_set_by)');
        $this->addSql('CREATE INDEX idx_kpi_aim_batch_target_set_by ON kpi_aim (batch_id, target_set_by)');
        $this->addSql('CREATE INDEX idx_kpi_aim_student_target_set_by ON kpi_aim (student_id, target_set_by)');
    }
}
