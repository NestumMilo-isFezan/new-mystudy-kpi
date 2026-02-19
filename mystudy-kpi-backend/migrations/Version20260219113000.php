<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260219113000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add uniqueness for mentorship by lecturer and intake batch';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE UNIQUE INDEX uniq_mentorship_lecturer_batch ON mentorship (lecturer_id, intake_batch_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX uniq_mentorship_lecturer_batch');
    }
}
